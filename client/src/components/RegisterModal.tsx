import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { GRADES, STREAMS, SUBJECTS_LIST, DEMOGRAPHICS, GENDERS } from "@/data/sa-locations";
import { CheckCircle, Check, X, MapPin, Loader2 } from "lucide-react";
import logoUrl from "@assets/Blue Minimal Idea Free Education Logo_1764023278343.png";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

// SA bounding box for Nominatim viewbox parameter (lon_min,lat_min,lon_max,lat_max)
const SA_VIEWBOX = "16.4,-34.9,33.0,-22.0";

interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    neighbourhood?: string;
    county?: string;
    state_district?: string;
    state?: string;
    municipality?: string;
  };
  type: string;
  class: string;
}

function extractMunicipalityName(place: NominatimResult, province: string): string | null {
  const addr = place.address;
  // Prefer county (district municipality) or city (metro)
  const candidates = [
    addr.county,
    addr.city,
    addr.state_district,
    addr.municipality,
    addr.town,
  ];
  for (const c of candidates) {
    if (c && c !== province && c !== "South Africa") return c;
  }
  // Fallback: first part of display_name
  const first = place.display_name.split(",")[0].trim();
  if (first && first !== province) return first;
  return null;
}

function extractTownshipName(place: NominatimResult, province: string, municipality: string): string | null {
  const addr = place.address;
  // Prefer suburb/neighbourhood/village/town for townships
  const candidates = [
    addr.suburb,
    addr.neighbourhood,
    addr.village,
    addr.town,
    addr.city,
  ];
  for (const c of candidates) {
    if (c && c !== province && c !== municipality && c !== "South Africa") return c;
  }
  const first = place.display_name.split(",")[0].trim();
  if (first && first !== province && first !== municipality) return first;
  return null;
}

async function searchMunicipalities(query: string, province: string): Promise<string[]> {
  const params = new URLSearchParams({
    q: `${query} ${province} South Africa`,
    countrycodes: "za",
    format: "json",
    addressdetails: "1",
    limit: "20",
    viewbox: SA_VIEWBOX,
    bounded: "1",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "Accept-Language": "en", "User-Agent": "BeSmartTutorials/1.0" },
  });
  const data: NominatimResult[] = await res.json();
  const seen = new Set<string>();
  const names: string[] = [];
  for (const place of data) {
    const name = extractMunicipalityName(place, province);
    if (name && !seen.has(name) && name.toLowerCase().includes(query.toLowerCase())) {
      seen.add(name);
      names.push(name);
    }
  }
  return names.slice(0, 10);
}

async function searchTownships(query: string, province: string, municipality: string): Promise<string[]> {
  const contextQuery = [query, municipality, province, "South Africa"].filter(Boolean).join(" ");
  const params = new URLSearchParams({
    q: contextQuery,
    countrycodes: "za",
    format: "json",
    addressdetails: "1",
    limit: "20",
    viewbox: SA_VIEWBOX,
    bounded: "1",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "Accept-Language": "en", "User-Agent": "BeSmartTutorials/1.0" },
  });
  const data: NominatimResult[] = await res.json();
  const seen = new Set<string>();
  const names: string[] = [];
  for (const place of data) {
    const name = extractTownshipName(place, province, municipality);
    if (name && !seen.has(name) && name.toLowerCase().includes(query.toLowerCase())) {
      seen.add(name);
      names.push(name);
    }
  }
  return names.slice(0, 10);
}

interface LocationSearchProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  fetchFn: (query: string) => Promise<string[]>;
  testId: string;
  disabled?: boolean;
  disabledReason?: string;
}

function LocationSearch({
  label, placeholder, value, onChange, fetchFn, testId, disabled, disabledReason,
}: LocationSearchProps) {
  const [inputVal, setInputVal] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setInputVal(value); }, [value]);

  useEffect(() => {
    if (inputVal.length < 2) { setSuggestions([]); setOpen(false); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (disabled) return;
      setLoading(true);
      try {
        const results = await fetchFn(inputVal);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [inputVal, fetchFn, disabled]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-1" ref={containerRef}>
      <Label>{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground pointer-events-none" />
        )}
        <Input
          value={inputVal}
          placeholder={disabled ? (disabledReason ?? "Select province first") : placeholder}
          disabled={disabled}
          data-testid={testId}
          className="pl-9"
          autoComplete="off"
          onChange={(e) => {
            const v = e.target.value;
            setInputVal(v);
            onChange(v);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
        />
        {open && suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-52 overflow-y-auto">
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setInputVal(name);
                  onChange(name);
                  setOpen(false);
                  setSuggestions([]);
                }}
              >
                <MapPin className="inline w-3 h-3 mr-1.5 text-muted-foreground" />
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
      {!disabled && inputVal.length > 0 && inputVal.length < 2 && (
        <p className="text-xs text-muted-foreground">Type at least 2 characters to search</p>
      )}
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  demographics: z.string().optional(),
  streetAddress: z.string().optional(),
  grade: z.string().optional(),
  streamOfStudy: z.string().optional(),
  parentDetails: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function RegisterModal({ open, onClose }: Props) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [township, setTownship] = useState("");
  const [provinceError, setProvinceError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", surname: "", email: "", phone: "",
      dateOfBirth: "", gender: "", demographics: "",
      streetAddress: "", grade: "", streamOfStudy: "", parentDetails: "",
    },
  });

  function resetAll() {
    setSubmitted(false);
    setSelectedSubjects([]);
    setProvince("");
    setMunicipality("");
    setTownship("");
    setProvinceError("");
    form.reset();
  }

  function handleClose() {
    onClose();
    setTimeout(resetAll, 300);
  }

  // Memoised fetch functions that capture the current province/municipality
  function municipalityFetcher(query: string) {
    return searchMunicipalities(query, province);
  }
  function townshipFetcher(query: string) {
    return searchTownships(query, province, municipality);
  }

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!province) {
        setProvinceError("Please select a province");
        throw new Error("Province required");
      }
      let age: number | undefined;
      if (data.dateOfBirth) {
        const birth = new Date(data.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      }
      return apiRequest("POST", "/api/learner-registrations", {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || null,
        age: age || null,
        gender: data.gender || null,
        demographics: data.demographics || null,
        streetAddress: data.streetAddress || null,
        province,
        municipality: municipality || null,
        township: township || null,
        schoolName: null,
        grade: data.grade || null,
        streamOfStudy: data.streamOfStudy || null,
        subjects: selectedSubjects.length > 0 ? selectedSubjects : null,
        parentDetails: data.parentDetails || null,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: any) => {
      if (error.message !== "Province required") {
        toast({
          title: "Registration failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  function toggleSubject(subject: string) {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  }

  function onSubmit(data: FormData) {
    if (!province) { setProvinceError("Please select a province"); return; }
    setProvinceError("");
    mutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0">
        {/* Sticky header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "hsl(var(--brand-blue))" }}
        >
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Be Smart" className="h-10 w-10 object-contain" />
            <div>
              <DialogTitle className="text-white text-lg font-bold m-0 p-0" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Learner Registration
              </DialogTitle>
              <DialogDescription className="sr-only">
                Register as a learner at Be Smart Online Tutorials
              </DialogDescription>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            data-testid="button-close-register-modal"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: "hsl(var(--brand-blue))" }}>
                  You're Registered!
                </h2>
                <p className="text-muted-foreground">
                  Welcome to Be Smart Online Tutorials. We'll be in touch shortly to get your sessions started.
                </p>
              </div>
              <Button
                size="lg"
                className="text-white px-8"
                style={{ backgroundColor: "hsl(var(--brand-blue))" }}
                onClick={handleClose}
                data-testid="button-done-registration"
              >
                Done
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Personal Details */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Personal Details</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl><Input placeholder="e.g. Thabo" {...field} data-testid="input-reg-first-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="surname" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname *</FormLabel>
                        <FormControl><Input placeholder="e.g. Mokoena" {...field} data-testid="input-reg-surname" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl><Input type="email" placeholder="your@email.com" {...field} data-testid="input-reg-email" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl><Input placeholder="e.g. 0712345678" {...field} data-testid="input-reg-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl><Input type="date" {...field} data-testid="input-reg-dob" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-reg-gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="demographics" render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Race / Demographics (optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-reg-demographics">
                              <SelectValue placeholder="Select (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEMOGRAPHICS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Location</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Province */}
                    <div className="space-y-1">
                      <Label htmlFor="reg-province">Province *</Label>
                      <Select
                        value={province}
                        onValueChange={(val) => {
                          setProvince(val);
                          setMunicipality("");
                          setTownship("");
                          setProvinceError("");
                        }}
                      >
                        <SelectTrigger id="reg-province" data-testid="select-reg-province">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {SA_PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {provinceError && <p className="text-sm text-destructive">{provinceError}</p>}
                    </div>

                    {/* Municipality live search */}
                    <LocationSearch
                      label="Municipality / Metro"
                      placeholder="Type to search e.g. City of Cape Town"
                      value={municipality}
                      onChange={(v) => {
                        setMunicipality(v);
                        setTownship("");
                      }}
                      fetchFn={municipalityFetcher}
                      testId="input-reg-municipality"
                      disabled={!province}
                      disabledReason="Select a province first"
                    />

                    {/* Township live search */}
                    <LocationSearch
                      label="Township / Area"
                      placeholder="Type to search e.g. Khayelitsha, Soweto"
                      value={township}
                      onChange={setTownship}
                      fetchFn={townshipFetcher}
                      testId="input-reg-township"
                      disabled={!province}
                      disabledReason="Select a province first"
                    />

                    <FormField control={form.control} name="streetAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address (optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. 12 Main Street" {...field} data-testid="input-reg-street" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Academic */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Academic Details</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField control={form.control} name="grade" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade / Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-reg-grade">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="streamOfStudy" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream of Study</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-reg-stream">
                              <SelectValue placeholder="Select stream" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STREAMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Subject checkboxes */}
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Subjects Needing Tutoring</p>
                    {selectedSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2" data-testid="list-reg-selected-subjects">
                        {selectedSubjects.map(s => (
                          <Badge
                            key={s}
                            className="flex items-center gap-1 text-white cursor-pointer text-xs"
                            style={{ backgroundColor: "hsl(var(--brand-blue))" }}
                            onClick={() => toggleSubject(s)}
                          >
                            {s} <X className="w-3 h-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 max-h-44 overflow-y-auto border rounded-md p-1">
                      {SUBJECTS_LIST.map(subject => {
                        const checked = selectedSubjects.includes(subject);
                        return (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            data-testid={`reg-subject-${subject.replace(/[\s/()]+/g, "-")}`}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-left w-full transition-colors ${checked ? "bg-blue-50 dark:bg-blue-950 font-medium" : "hover:bg-muted"}`}
                          >
                            <span className={`flex-shrink-0 w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${checked ? "border-blue-600 bg-blue-600" : "border-muted-foreground"}`}>
                              {checked && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            <span className="leading-tight">{subject}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Parent/Guardian */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Parent / Guardian</h3>
                  <FormField control={form.control} name="parentDetails" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Name & Contact (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mrs. Mokoena — 082 123 4567" {...field} data-testid="input-reg-parent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: "hsl(var(--brand-blue))" }}
                  disabled={mutation.isPending}
                  data-testid="button-reg-submit"
                >
                  {mutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                  ) : "Complete Registration"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

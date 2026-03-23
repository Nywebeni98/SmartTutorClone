import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
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
import { getMunicipalities, getTownships } from "@/data/sa-location-data";
import { CheckCircle, Check, X, Loader2 } from "lucide-react";
import logoUrl from "@assets/Blue Minimal Idea Free Education Logo_1764023278343.png";

const SA_PROVINCES = [
  "Eastern Cape","Free State","Gauteng","KwaZulu-Natal",
  "Limpopo","Mpumalanga","Northern Cape","North West","Western Cape",
];

const OTHER = "__other__";

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
  parentEmail: z.string().email("Please enter a valid parent email").optional().or(z.literal("")),
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

  // Location state
  const [province, setProvince] = useState("");
  const [municipalitySelect, setMunicipalitySelect] = useState(""); // dropdown value (may be OTHER)
  const [municipalityOther, setMunicipalityOther] = useState("");
  const [townshipSelect, setTownshipSelect] = useState(""); // dropdown value (may be OTHER)
  const [townshipOther, setTownshipOther] = useState("");
  const [provinceError, setProvinceError] = useState("");

  const municipalities = getMunicipalities(province);
  const effectiveMunicipality = municipalitySelect === OTHER ? municipalityOther : municipalitySelect;
  const townships = getTownships(province, municipalitySelect === OTHER ? "" : municipalitySelect);
  const effectiveTownship = townshipSelect === OTHER ? townshipOther : townshipSelect;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"", surname:"", email:"", phone:"",
      dateOfBirth:"", gender:"", demographics:"",
      streetAddress:"", grade:"", streamOfStudy:"",
      parentDetails:"", parentEmail:"",
    },
  });

  function resetAll() {
    setSubmitted(false);
    setSelectedSubjects([]);
    setProvince("");
    setMunicipalitySelect("");
    setMunicipalityOther("");
    setTownshipSelect("");
    setTownshipOther("");
    setProvinceError("");
    form.reset();
  }

  function handleClose() {
    onClose();
    setTimeout(resetAll, 300);
  }

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!province) { setProvinceError("Please select a province"); throw new Error("Province required"); }
      setProvinceError("");

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
        municipality: effectiveMunicipality || null,
        township: effectiveTownship || null,
        schoolName: null,
        grade: data.grade || null,
        streamOfStudy: data.streamOfStudy || null,
        subjects: selectedSubjects.length > 0 ? selectedSubjects : null,
        parentDetails: data.parentDetails || null,
        parentEmail: data.parentEmail || null,
      });
    },
    onSuccess: () => setSubmitted(true),
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

                {/* ── Personal Details ── */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Personal Details</h3>
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
                            <SelectTrigger data-testid="select-reg-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                            <SelectTrigger data-testid="select-reg-demographics"><SelectValue placeholder="Select (optional)" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEMOGRAPHICS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </section>

                {/* ── Location ── */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Location</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* Province */}
                    <div className="space-y-1">
                      <Label>Province *</Label>
                      <Select
                        value={province}
                        onValueChange={(val) => {
                          setProvince(val);
                          setMunicipalitySelect("");
                          setMunicipalityOther("");
                          setTownshipSelect("");
                          setTownshipOther("");
                          setProvinceError("");
                        }}
                      >
                        <SelectTrigger data-testid="select-reg-province">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {SA_PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {provinceError && <p className="text-sm text-destructive">{provinceError}</p>}
                    </div>

                    {/* Municipality / Metro */}
                    <div className="space-y-1">
                      <Label>Municipality / Metro</Label>
                      <Select
                        value={municipalitySelect}
                        disabled={!province}
                        onValueChange={(val) => {
                          setMunicipalitySelect(val);
                          setMunicipalityOther("");
                          setTownshipSelect("");
                          setTownshipOther("");
                        }}
                      >
                        <SelectTrigger data-testid="select-reg-municipality">
                          <SelectValue placeholder={!province ? "Select province first" : "Select municipality"} />
                        </SelectTrigger>
                        <SelectContent>
                          {municipalities.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          <SelectItem value={OTHER}>Other — type below</SelectItem>
                        </SelectContent>
                      </Select>
                      {municipalitySelect === OTHER && (
                        <Input
                          placeholder="Type your municipality / metro"
                          value={municipalityOther}
                          onChange={(e) => setMunicipalityOther(e.target.value)}
                          data-testid="input-reg-municipality-other"
                          className="mt-1"
                        />
                      )}
                    </div>

                    {/* Township / Area */}
                    <div className="space-y-1">
                      <Label>Township / Area</Label>
                      <Select
                        value={townshipSelect}
                        disabled={!province}
                        onValueChange={(val) => {
                          setTownshipSelect(val);
                          setTownshipOther("");
                        }}
                      >
                        <SelectTrigger data-testid="select-reg-township">
                          <SelectValue placeholder={!province ? "Select province first" : townships.length > 0 ? "Select township / area" : "Select or type below"} />
                        </SelectTrigger>
                        <SelectContent>
                          {townships.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          <SelectItem value={OTHER}>Other — type below</SelectItem>
                        </SelectContent>
                      </Select>
                      {(townshipSelect === OTHER || (province && townships.length === 0)) && (
                        <Input
                          placeholder="Type your township / area / suburb"
                          value={townshipOther}
                          onChange={(e) => setTownshipOther(e.target.value)}
                          data-testid="input-reg-township-other"
                          className="mt-1"
                        />
                      )}
                    </div>

                    {/* Street address */}
                    <FormField control={form.control} name="streetAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address (optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. 12 Main Street" {...field} data-testid="input-reg-street" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </section>

                {/* ── Academic Details ── */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Academic Details</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField control={form.control} name="grade" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade / Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-reg-grade"><SelectValue placeholder="Select grade" /></SelectTrigger>
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
                            <SelectTrigger data-testid="select-reg-stream"><SelectValue placeholder="Select stream" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STREAMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Subject selection */}
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Subjects Needing Tutoring</p>
                    {selectedSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2" data-testid="list-reg-selected-subjects">
                        {selectedSubjects.map(s => (
                          <Badge
                            key={s}
                            onClick={() => toggleSubject(s)}
                            className="flex items-center gap-1 text-white cursor-pointer text-xs"
                            style={{ backgroundColor: "hsl(var(--brand-blue))" }}
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
                </section>

                {/* ── Parent / Guardian ── */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Parent / Guardian</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField control={form.control} name="parentDetails" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name & Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mrs. Mokoena — 082 123 4567" {...field} data-testid="input-reg-parent" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="parentEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Email Address (optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="parent@email.com" {...field} data-testid="input-reg-parent-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </section>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: "hsl(var(--brand-blue))" }}
                  disabled={mutation.isPending}
                  data-testid="button-reg-submit"
                >
                  {mutation.isPending
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                    : "Complete Registration"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

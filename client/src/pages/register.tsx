import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/Blue Minimal Idea Free Education Logo_1764023278343.png";
import {
  GRADES,
  STREAMS,
  SUBJECTS_LIST,
  DEMOGRAPHICS,
  GENDERS,
  getMunicipalities,
  getTownships,
  getSchools,
} from "@/data/sa-locations";
import { CheckCircle, Check, X } from "lucide-react";

const SA_PROVINCES_LIST = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const coreSchema = z.object({
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

type CoreFormData = z.infer<typeof coreSchema>;

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Location state — managed separately to avoid react-hook-form cascade issues
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [township, setTownship] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [provinceError, setProvinceError] = useState("");

  const municipalities = getMunicipalities(province);
  const townships = province && municipality ? getTownships(province, municipality) : [];
  const schools = province && municipality ? getSchools(province, municipality) : [];

  const form = useForm<CoreFormData>({
    resolver: zodResolver(coreSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      demographics: "",
      streetAddress: "",
      grade: "",
      streamOfStudy: "",
      parentDetails: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CoreFormData) => {
      let age: number | undefined;
      if (data.dateOfBirth) {
        const birth = new Date(data.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      }

      const payload = {
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
        schoolName: schoolName || null,
        grade: data.grade || null,
        streamOfStudy: data.streamOfStudy || null,
        subjects: selectedSubjects.length > 0 ? selectedSubjects : null,
        parentDetails: data.parentDetails || null,
      };

      return apiRequest("POST", "/api/learner-registrations", payload);
    },
    onSuccess: () => {
      setSubmitted(true);
      localStorage.setItem("learner_registered", "true");
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  function toggleSubject(subject: string) {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  }

  function onSubmit(data: CoreFormData) {
    if (!province) {
      setProvinceError("Please select a province");
      return;
    }
    setProvinceError("");
    mutation.mutate(data);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: "hsl(var(--brand-blue))" }}>
            You're Registered!
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome to Be Smart Online Tutorials. We'll be in touch shortly to confirm your sessions.
          </p>
          <Button
            size="lg"
            className="w-full text-white"
            style={{ backgroundColor: "hsl(var(--brand-blue))" }}
            onClick={() => navigate("/")}
            data-testid="button-go-home"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full py-6 flex flex-col items-center gap-2" style={{ backgroundColor: "hsl(var(--brand-blue))" }}>
        <img src={logoUrl} alt="Be Smart Online Tutorials Logo" className="h-16 w-16 object-contain" />
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          data-testid="text-register-heading"
        >
          Learner Registration
        </h1>
        <p className="text-blue-100 text-sm text-center px-4">
          Register today and take the first step toward academic excellence
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Personal Details */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: "hsl(var(--brand-blue))" }}>
                Personal Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Thabo" {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mokoena" {...field} data-testid="input-surname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 0712345678" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-dob" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDERS.map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demographics"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Race/Demographics</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-demographics">
                            <SelectValue placeholder="Select (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEMOGRAPHICS.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Location — pure state, no react-hook-form */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: "hsl(var(--brand-blue))" }}>
                Location
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="province-select">Province *</Label>
                  <Select
                    value={province}
                    onValueChange={(val) => {
                      setProvince(val);
                      setMunicipality("");
                      setTownship("");
                      setSchoolName("");
                      setProvinceError("");
                    }}
                  >
                    <SelectTrigger id="province-select" data-testid="select-province">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {SA_PROVINCES_LIST.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {provinceError && <p className="text-sm text-destructive">{provinceError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipality-select">Municipality / Metro</Label>
                  <Select
                    value={municipality}
                    onValueChange={(val) => {
                      setMunicipality(val);
                      setTownship("");
                      setSchoolName("");
                    }}
                    disabled={!province}
                  >
                    <SelectTrigger id="municipality-select" data-testid="select-municipality">
                      <SelectValue placeholder={province ? "Select municipality" : "Select province first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalities.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="township-select">Township / Area</Label>
                  <Select
                    value={township}
                    onValueChange={setTownship}
                    disabled={!municipality}
                  >
                    <SelectTrigger id="township-select" data-testid="select-township">
                      <SelectValue placeholder={municipality ? "Select area" : "Select municipality first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {townships.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other / Not listed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 12 Main Street" {...field} data-testid="input-street-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Academic Details */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: "hsl(var(--brand-blue))" }}>
                Academic Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="school-select">School Name</Label>
                  <Select
                    value={schoolName}
                    onValueChange={setSchoolName}
                  >
                    <SelectTrigger id="school-select" data-testid="select-school">
                      <SelectValue placeholder="Select or type school name" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other / Not listed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade / Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-grade">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GRADES.map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streamOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream of Study</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-stream">
                            <SelectValue placeholder="Select stream" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STREAMS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subject selection */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Subjects Needing Tutoring</p>
                {selectedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3" data-testid="list-selected-subjects">
                    {selectedSubjects.map(s => (
                      <Badge
                        key={s}
                        className="flex items-center gap-1 cursor-pointer text-white"
                        style={{ backgroundColor: "hsl(var(--brand-blue))" }}
                        onClick={() => toggleSubject(s)}
                        data-testid={`badge-subject-${s.replace(/[\s/()]+/g, "-")}`}
                      >
                        {s}
                        <X className="w-3 h-3" />
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3" data-testid="grid-subjects">
                  {SUBJECTS_LIST.map(subject => {
                    const checked = selectedSubjects.includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleSubject(subject)}
                        data-testid={`checkbox-subject-${subject.replace(/[\s/()]+/g, "-")}`}
                        className={`flex items-center gap-2 p-2 rounded-md text-sm text-left w-full transition-colors ${checked ? "bg-blue-50 dark:bg-blue-950 font-medium" : "hover:bg-muted"}`}
                      >
                        <span
                          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${checked ? "border-blue-600 bg-blue-600" : "border-muted-foreground"}`}
                        >
                          {checked && <Check className="w-3 h-3 text-white" />}
                        </span>
                        <span className="leading-tight">{subject}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Parent/Guardian */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: "hsl(var(--brand-blue))" }}>
                Parent / Guardian Details
              </h2>
              <FormField
                control={form.control}
                name="parentDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name & Contact (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Mrs. Mokoena - 082 123 4567"
                        {...field}
                        data-testid="input-parent-details"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full text-white font-semibold"
                style={{ backgroundColor: "hsl(var(--brand-blue))" }}
                disabled={mutation.isPending}
                data-testid="button-submit-registration"
              >
                {mutation.isPending ? "Submitting..." : "Complete Registration"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/")}
                data-testid="button-skip-registration"
              >
                Skip for now — go to homepage
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}

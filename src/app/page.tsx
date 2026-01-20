"use client";

import { useState } from "react";

type RelationshipStatus = "single" | "married" | null;

interface FormData {
  status: RelationshipStatus;
  // Single questions
  singleChallenges: string[];
  singleDesires: string;
  singleFears: string;
  singleTopics: string[];
  // Married questions
  marriedChallenges: string[];
  marriedYears: string;
  marriedStrengths: string;
  marriedTopics: string[];
  // Common
  additionalThoughts: string;
}

const singleChallengeOptions = [
  "Finding genuine connections",
  "Knowing when I'm ready for a relationship",
  "Dealing with loneliness",
  "Understanding what I want in a partner",
  "Healing from past relationships",
  "Balancing career and dating",
  "Building self-confidence",
  "Navigating dating apps",
];

const singleTopicOptions = [
  "How to prepare for a healthy relationship",
  "Self-love and personal growth",
  "Identifying red flags",
  "Building emotional intelligence",
  "Communication skills",
  "Setting healthy boundaries",
  "Healing from past hurts",
  "God's design for relationships",
];

const marriedChallengeOptions = [
  "Communication issues",
  "Financial stress",
  "Intimacy challenges",
  "Work-life balance",
  "Parenting disagreements",
  "Extended family dynamics",
  "Growing apart",
  "Trust issues",
  "Different love languages",
];

const marriedTopicOptions = [
  "Rebuilding trust and intimacy",
  "Effective communication strategies",
  "Managing finances together",
  "Keeping the spark alive",
  "Conflict resolution",
  "Balancing family and marriage",
  "Growing together spiritually",
  "Supporting each other's dreams",
];

const yearsOptions = [
  "Less than 1 year",
  "1-5 years",
  "6-10 years",
  "11-20 years",
  "20+ years",
];

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-[var(--love-600)] mb-2">
        <span>Step {current} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-[var(--love-100)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--love-400)] to-[var(--love-600)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => toggle(option)}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
            selected.includes(option)
              ? "border-[var(--love-500)] bg-[var(--love-100)] text-[var(--love-800)]"
              : "border-[var(--love-200)] bg-white hover:border-[var(--love-300)] hover:bg-[var(--love-50)]"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                selected.includes(option)
                  ? "border-[var(--love-500)] bg-[var(--love-500)]"
                  : "border-[var(--love-300)]"
              }`}
            >
              {selected.includes(option) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
            selected === option
              ? "border-[var(--love-500)] bg-[var(--love-100)] text-[var(--love-800)]"
              : "border-[var(--love-200)] bg-white hover:border-[var(--love-300)] hover:bg-[var(--love-50)]"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === option
                  ? "border-[var(--love-500)]"
                  : "border-[var(--love-300)]"
              }`}
            >
              {selected === option && (
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--love-500)]" />
              )}
            </div>
            <span className="text-sm">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    status: null,
    singleChallenges: [],
    singleDesires: "",
    singleFears: "",
    singleTopics: [],
    marriedChallenges: [],
    marriedYears: "",
    marriedStrengths: "",
    marriedTopics: [],
    additionalThoughts: "",
  });

  const totalSteps = formData.status ? 4 : 1;

  const updateForm = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit survey. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.status !== null;
      case 2:
        if (formData.status === "single") {
          return formData.singleChallenges.length > 0;
        }
        return formData.marriedChallenges.length > 0 && formData.marriedYears !== "";
      case 3:
        if (formData.status === "single") {
          return formData.singleDesires.trim() !== "" || formData.singleFears.trim() !== "";
        }
        return formData.marriedStrengths.trim() !== "";
      case 4:
        if (formData.status === "single") {
          return formData.singleTopics.length > 0;
        }
        return formData.marriedTopics.length > 0;
      default:
        return true;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="mb-6">
            <HeartIcon className="w-20 h-20 text-[var(--love-500)] mx-auto animate-pulse-heart" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--love-800)] mb-4">
            Thank You!
          </h1>
          <p className="text-[var(--love-600)] mb-6">
            Your responses have been submitted. We appreciate you taking the time to help shape the Love Code Conference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <HeartIcon className="w-8 h-8 text-[var(--love-500)] animate-pulse-heart" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[var(--love-800)]">
              Love Code Conference
            </h1>
            <p className="text-xs text-[var(--love-500)]">Survey 2026</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">
          <ProgressBar current={step} total={totalSteps} />

          <div className="bg-white rounded-2xl shadow-lg shadow-[var(--love-200)]/50 p-6 sm:p-8 animate-fade-in">
            {/* Step 1: Relationship Status */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    Welcome!
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Help us create a conference that addresses real issues. This survey is completely anonymous.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateForm("status", "single")}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.03] ${
                      formData.status === "single"
                        ? "border-[var(--love-500)] bg-[var(--love-100)]"
                        : "border-[var(--love-200)] bg-white hover:border-[var(--love-300)]"
                    }`}
                  >
                    <div className="text-4xl mb-3">💝</div>
                    <div className="font-bold text-[var(--love-800)]">Single</div>
                    <div className="text-xs text-[var(--love-500)] mt-1">
                      Not currently married
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateForm("status", "married")}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.03] ${
                      formData.status === "married"
                        ? "border-[var(--love-500)] bg-[var(--love-100)]"
                        : "border-[var(--love-200)] bg-white hover:border-[var(--love-300)]"
                    }`}
                  >
                    <div className="text-4xl mb-3">💑</div>
                    <div className="font-bold text-[var(--love-800)]">Married</div>
                    <div className="text-xs text-[var(--love-500)] mt-1">
                      Currently married
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Challenges (Conditional) */}
            {step === 2 && formData.status === "single" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    What Challenges Do You Face?
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Select all that apply to your journey.
                  </p>
                </div>

                <CheckboxGroup
                  options={singleChallengeOptions}
                  selected={formData.singleChallenges}
                  onChange={(selected) => updateForm("singleChallenges", selected)}
                />
              </div>
            )}

            {step === 2 && formData.status === "married" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    Tell Us About Your Marriage
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Help us understand your experience.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--love-700)] mb-3">
                      How long have you been married?
                    </label>
                    <RadioGroup
                      options={yearsOptions}
                      selected={formData.marriedYears}
                      onChange={(value) => updateForm("marriedYears", value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--love-700)] mb-3">
                      What challenges do you face? (Select all that apply)
                    </label>
                    <CheckboxGroup
                      options={marriedChallengeOptions}
                      selected={formData.marriedChallenges}
                      onChange={(selected) => updateForm("marriedChallenges", selected)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Deep Questions (Conditional) */}
            {step === 3 && formData.status === "single" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    Your Heart&apos;s Voice
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Share what&apos;s on your heart. Be as open as you feel comfortable.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--love-700)] mb-2">
                      What do you most desire in a future relationship?
                    </label>
                    <textarea
                      value={formData.singleDesires}
                      onChange={(e) => updateForm("singleDesires", e.target.value)}
                      placeholder="Share your hopes and dreams..."
                      rows={3}
                      className="w-full p-4 rounded-xl border-2 border-[var(--love-200)] focus:border-[var(--love-500)] focus:outline-none transition-colors bg-white text-[var(--love-900)] placeholder:text-[var(--love-300)] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--love-700)] mb-2">
                      What fears or concerns do you have about relationships?
                    </label>
                    <textarea
                      value={formData.singleFears}
                      onChange={(e) => updateForm("singleFears", e.target.value)}
                      placeholder="It's okay to be vulnerable..."
                      rows={3}
                      className="w-full p-4 rounded-xl border-2 border-[var(--love-200)] focus:border-[var(--love-500)] focus:outline-none transition-colors bg-white text-[var(--love-900)] placeholder:text-[var(--love-300)] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && formData.status === "married" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    Your Marriage Story
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Help us understand your journey together.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--love-700)] mb-2">
                    What are the greatest strengths in your marriage?
                  </label>
                  <textarea
                    value={formData.marriedStrengths}
                    onChange={(e) => updateForm("marriedStrengths", e.target.value)}
                    placeholder="What keeps your bond strong..."
                    rows={4}
                    className="w-full p-4 rounded-xl border-2 border-[var(--love-200)] focus:border-[var(--love-500)] focus:outline-none transition-colors bg-white text-[var(--love-900)] placeholder:text-[var(--love-300)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Topics Interest */}
            {step === 4 && formData.status === "single" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    What Topics Interest You?
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Select topics you&apos;d like addressed at the conference.
                  </p>
                </div>

                <CheckboxGroup
                  options={singleTopicOptions}
                  selected={formData.singleTopics}
                  onChange={(selected) => updateForm("singleTopics", selected)}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--love-700)] mb-2">
                    Any other thoughts or topics? (Optional)
                  </label>
                  <textarea
                    value={formData.additionalThoughts}
                    onChange={(e) => updateForm("additionalThoughts", e.target.value)}
                    placeholder="Share anything else on your mind..."
                    rows={3}
                    className="w-full p-4 rounded-xl border-2 border-[var(--love-200)] focus:border-[var(--love-500)] focus:outline-none transition-colors bg-white text-[var(--love-900)] placeholder:text-[var(--love-300)] resize-none"
                  />
                </div>
              </div>
            )}

            {step === 4 && formData.status === "married" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--love-800)] mb-2">
                    What Topics Interest You?
                  </h2>
                  <p className="text-sm text-[var(--love-600)]">
                    Select topics you&apos;d like addressed at the conference.
                  </p>
                </div>

                <CheckboxGroup
                  options={marriedTopicOptions}
                  selected={formData.marriedTopics}
                  onChange={(selected) => updateForm("marriedTopics", selected)}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--love-700)] mb-2">
                    Any other thoughts or topics? (Optional)
                  </label>
                  <textarea
                    value={formData.additionalThoughts}
                    onChange={(e) => updateForm("additionalThoughts", e.target.value)}
                    placeholder="Share anything else on your mind..."
                    rows={3}
                    className="w-full p-4 rounded-xl border-2 border-[var(--love-200)] focus:border-[var(--love-500)] focus:outline-none transition-colors bg-white text-[var(--love-900)] placeholder:text-[var(--love-300)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 p-4 rounded-xl border-2 border-[var(--love-300)] text-[var(--love-600)] font-medium transition-all hover:bg-[var(--love-50)] hover:border-[var(--love-400)]"
                >
                  Back
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex-1 p-4 rounded-xl font-medium transition-all ${
                    canProceed()
                      ? "bg-gradient-to-r from-[var(--love-500)] to-[var(--love-600)] text-white hover:from-[var(--love-600)] hover:to-[var(--love-700)] shadow-lg shadow-[var(--love-300)]"
                      : "bg-[var(--love-200)] text-[var(--love-400)] cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className={`flex-1 p-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    canProceed() && !isSubmitting
                      ? "bg-gradient-to-r from-[var(--love-500)] to-[var(--love-600)] text-white hover:from-[var(--love-600)] hover:to-[var(--love-700)] shadow-lg shadow-[var(--love-300)]"
                      : "bg-[var(--love-200)] text-[var(--love-400)] cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      Submit
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-[var(--love-400)]">
          Love Code Conference 2026 • Made with love
        </p>
      </footer>
    </div>
  );
}

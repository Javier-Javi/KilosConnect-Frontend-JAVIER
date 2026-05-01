import React, { useId, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react"; // Added for icons

// Use "../../" to go up two levels (from 'pages' to 'src') then into 'assets'
import KilosGymImg from "../assets/image-5.png";
import KILOSWhiteLogo1 from "../assets/KILOS-white-logo-1.png";

const formFields = [
  { id: "username", label: "Username", type: "text", autoComplete: "username" },
  { id: "password", label: "Password", type: "password", autoComplete: "current-password" },
] as const;

export const LoginPage: React.FC = () => {
  const formId = useId();
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for visibility

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    // UI only - no authentication
    console.log("Form submitted with:", formValues);
  };

  return (
    <main className="flex w-full h-screen overflow-hidden">
      {/* Left panel */}
      <section
        aria-labelledby={`${formId}-title`}
        className="w-full md:w-[480px] lg:w-[520px] shrink-0 min-h-screen 
             flex flex-col items-center justify-center px-12 py-12
             bg-[linear-gradient(180deg,rgba(7,40,33,1)_21%,rgba(17,27,48,1)_100%)]"
      >
        {/* Logo */}
        <img
          className="w-[180px] object-contain mb-8"
          alt="KILOS"
          src={KILOSWhiteLogo1}
        />

        {/* Title */}
        <h1
          id={`${formId}-title`}
          className="font-poppins font-semibold text-[#fdffe0] text-4xl text-center mb-8"
        >
          LOG IN
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          aria-label="Login form"
          className="flex flex-col gap-4 w-full max-w-[380px]"
        >
          {/* Error message */}
          {error && (
            <div className="w-full bg-red-500/20 border border-red-400 rounded-md px-3 py-2">
              <p className="font-poppins text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {formFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1">
              <label
                htmlFor={`${formId}-${field.id}`}
                className="font-poppins text-[#fdffe0] text-lg"
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={`${formId}-${field.id}`}
                  name={field.id}
                  // Toggle type between password and text if it's the password field
                  type={field.id === "password" && showPassword ? "text" : field.type}
                  autoComplete={field.autoComplete}
                  value={formValues[field.id]}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.id]: event.target.value,
                    }))
                  }
                  aria-label={field.label}
                  className="w-full h-[42px] bg-white rounded-md px-3 pr-10
                           text-black font-poppins text-base
                           shadow-[0_0_0_1px_#00000014]
                           focus:outline-none focus:ring-2 focus:ring-[#ba6300]"
                />
                
                {/* Eye Icon for Password field */}
                {field.id === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[42px] mt-4 flex items-center justify-center
                       bg-[#ba6300] rounded-md cursor-pointer disabled:opacity-60
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-[#fdffe0]
                       hover:bg-[#a05500] transition-colors"
          >
            <span className="font-poppins font-medium text-[#fdffe0] text-xl">
              {loading ? "Logging in..." : "Log in"}
            </span>
          </button>
        </form>
      </section>

      {/* Right panel - hidden on mobile */}
      <aside className="hidden md:block flex-1 h-full">
        <img className="w-full h-full object-cover" alt="Gym interior" src={KilosGymImg} />
      </aside>
    </main>
  );
};

export default LoginPage;
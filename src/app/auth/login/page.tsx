import { ApiForm } from "@/components/api-client";

export default function LoginPage() {
  return (
    <section>
      <h1>Authentication</h1>
      <p>Create account and login. New users are pending until approved by admin.</p>
      <div className="grid">
        <ApiForm
          title="Register"
          endpoint="/api/auth/register"
          fields={[
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Password", type: "password", required: true },
            { name: "role", label: "Role (USER/DEVELOPER/TESTER)", required: true }
          ]}
        />
        <ApiForm
          title="Login"
          endpoint="/api/auth/login"
          fields={[
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Password", type: "password", required: true }
          ]}
          tokenLabel="JWT not required"
        />
        <ApiForm
          title="Admin Login (3-step PIN)"
          endpoint="/api/auth/admin-login"
          defaultBody={JSON.stringify({ email: "admin@webdevorg.com", password: "Admin@123", pins: ["1426", "6241", "7777"] }, null, 2)}
        />
      </div>
    </section>
  );
}

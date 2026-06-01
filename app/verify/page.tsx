import { verifyOTP } from "@/actions/actions";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const { email } = await searchParams;

  async function handleVerify(formData: FormData) {
    "use server";

    const otp = formData.get("otp") as string;

    const result = await verifyOTP(email as string, otp);

    console.log("OTP Valid:", result);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={handleVerify} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-bold">Verify OTP</h1>

        <p>OTP sent to: {email}</p>

        <input
          name="otp"
          type="text"
          placeholder="Enter OTP"
          className="border p-2 rounded"
          required
        />

        <button type="submit" className="bg-black text-white p-2 rounded">
          Verify OTP
        </button>
      </form>
    </div>
  );
}

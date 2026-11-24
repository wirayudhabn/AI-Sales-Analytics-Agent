import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Logo perkiraan. Ganti isinya dengan SVG logo asli dari Figma.
const IrisLogo = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" role="img" aria-label="Iris">
        <circle cx="40" cy="40" r="40" fill="#2563EB" />
        <path d="M40 16 45.5 34.5 64 40 45.5 45.5 40 64 34.5 45.5 16 40 34.5 34.5Z" fill="white" />
    </svg>
);

const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-5 py-4 outline-none placeholder:text-gray-500 focus:border-blue-600";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            setError("Email dan password wajib diisi.");
            return;
        }
        setError("");

        // TODO: sambungkan ke endpoint login backend (kirim email, password, remember).
        // Untuk sementara, langsung menuju dashboard sebagai simulasi.
        navigate("/");
    };

    return (
        <div className="min-h-dvh bg-white flex items-center justify-center p-8">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Kolom kiri: form */}
                <section className="flex flex-col">
                    <div className="mb-16">
                        <IrisLogo />
                    </div>

                    <h1 className="text-4xl font-semibold leading-tight text-[#0B2447]">
                        Halo, Selamat
                        <br />
                        Datang Kembali
                    </h1>
                    <p className="mt-8 max-w-md text-slate-600">
                        Selamat bertugas, silakan masuk untuk memproses transaksi dan melihat sesi kasir.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-4" noValidate>
                        <input
                            type="email"
                            aria-label="Email"
                            placeholder="Email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                        />
                        <input
                            type="password"
                            aria-label="Password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                        />

                        <div className="flex items-center justify-between text-slate-600">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <button type="button" className="cursor-pointer hover:underline">
                                Forgot Password
                            </button>
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="mt-6 self-start cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    </form>
                </section>

                {/* Kolom kanan: ilustrasi (letakkan file di frontend/public/login-barista.png) */}
                <section className="hidden md:block">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-100">
                        <img
                            src="/login-barista.png"
                            alt="Barista menyiapkan kopi"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
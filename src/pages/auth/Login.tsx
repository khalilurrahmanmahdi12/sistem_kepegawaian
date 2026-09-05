import { useState } from 'react'
import { useNavigate } from 'react-router'

import {
  Mail,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from 'lucide-react'

import { toast } from 'sonner'

import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()

  const {
    kirimOtp,
    verifikasiOtp,
  } = useAuth()

  const [
    identifier,
    setIdentifier,
  ] = useState('')

  const [
    otp,
    setOtp,
  ] = useState('')

  const [
    otpSent,
    setOtpSent,
  ] = useState(false)

  const [
    tujuanOtp,
    setTujuanOtp,
  ] = useState('')

  const handleKirimOtp = () => {
    if (!identifier.trim()) {
      toast.error(
        'Masukkan email atau nomor WhatsApp.'
      )
      return
    }

    const user =
      kirimOtp(identifier)

    if (!user) {
      toast.error(
        'Email atau nomor WhatsApp tidak terdaftar.'
      )
      return
    }

    setTujuanOtp(
      identifier.includes('@')
        ? user.email
        : user.whatsapp.replace(
            /(\d{4})\d+(\d{3})/,
            '$1••••$2'
          )
    )

    setOtpSent(true)

    toast.success(
      'Kode OTP berhasil dikirim.'
    )
  }

  const handleVerifikasiOtp =
    () => {
      if (otp.length !== 6) {
        toast.error(
          'Masukkan 6 digit kode OTP.'
        )
        return
      }

      const berhasil =
        verifikasiOtp(otp)

      if (!berhasil) {
        toast.error(
          'Kode OTP tidak valid.'
        )
        return
      }

      toast.success(
        'Login berhasil.'
      )

      navigate('/dashboard')
    }

  const handleKembali = () => {
    setOtpSent(false)
    setOtp('')
    setTujuanOtp('')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* BAGIAN KIRI */}
        <div className="relative hidden overflow-hidden bg-[#020617] lg:flex lg:flex-col">
          {/* Brand */}
          <div className="px-12 pt-12 xl:px-16 xl:pt-14">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-950">
                <UsersRound
                  size={26}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Kepegawaian Digital
                </h1>

                <p className="mt-0.5 text-xs text-slate-400">
                  Sistem Manajemen SDM
                </p>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="flex flex-1 items-center px-12 xl:px-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Manajemen Kepegawaian
              </p>

              <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Kelola aktivitas kepegawaian
                <br />
                dalam satu sistem.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Kelola data karyawan, absensi, cuti, izin,
                lembur, persetujuan, divisi, jabatan, dan
                laporan kepegawaian melalui satu dashboard
                terintegrasi.
              </p>
            </div>
          </div>

          {/* Footer kiri */}
          <div className="px-12 pb-10 xl:px-16">
            <p className="text-xs text-slate-500">
              Kepegawaian Digital • Sistem simulasi untuk
              portofolio
            </p>
          </div>
        </div>

        {/* BAGIAN KANAN */}
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <UsersRound
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1 className="font-bold text-slate-950">
                  Kepegawaian Digital
                </h1>

                <p className="text-xs text-slate-500">
                  Sistem Manajemen SDM
                </p>
              </div>
            </div>

            {!otpSent ? (
              <>
                {/* Header form */}
                <div className="mb-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <ShieldCheck
                      size={24}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                    Masuk ke Sistem
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Gunakan email atau nomor WhatsApp yang
                    terdaftar untuk menerima kode OTP.
                  </p>
                </div>

                {/* Form identifier */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Email atau Nomor WhatsApp
                  </label>

                  <div className="relative">
                    {identifier.includes('@') ? (
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    ) : (
                      <Smartphone
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    )}

                    <input
                      type="text"
                      value={identifier}
                      onChange={(event) =>
                        setIdentifier(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          'Enter'
                        ) {
                          handleKirimOtp()
                        }
                      }}
                      placeholder="nama@perusahaan.com atau 081234567890"
                      className="
                        h-12
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        pl-11
                        pr-4
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-slate-900
                        focus:ring-1
                        focus:ring-slate-900
                      "
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleKirimOtp
                  }
                  className="
                    mt-6
                    h-12
                    w-full
                    rounded-lg
                    bg-[#020617]
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-slate-900
                    active:scale-[0.99]
                  "
                >
                  Kirim Kode OTP
                </button>
              </>
            ) : (
              <>
                {/* VERIFIKASI OTP */}
                <div className="mb-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <ShieldCheck
                      size={24}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                    Verifikasi OTP
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Masukkan kode 6 digit yang telah dikirim
                    ke akun Anda.
                  </p>
                </div>

                <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">
                    Kode OTP dikirim ke
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {tujuanOtp}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Kode OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(
                          /\D/g,
                          ''
                        )
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        'Enter'
                      ) {
                        handleVerifikasiOtp()
                      }
                    }}
                    placeholder="000000"
                    className="
                      h-14
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      text-center
                      text-2xl
                      font-semibold
                      tracking-[0.6em]
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-300
                      focus:border-slate-900
                      focus:ring-1
                      focus:ring-slate-900
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    handleVerifikasiOtp
                  }
                  className="
                    mt-6
                    h-12
                    w-full
                    rounded-lg
                    bg-[#020617]
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-slate-900
                    active:scale-[0.99]
                  "
                >
                  Verifikasi & Masuk
                </button>

                <button
                  type="button"
                  onClick={
                    handleKembali
                  }
                  className="
                    mt-3
                    h-11
                    w-full
                    rounded-lg
                    text-sm
                    font-medium
                    text-slate-500
                    transition
                    hover:bg-slate-200/60
                    hover:text-slate-900
                  "
                >
                  Ganti email atau nomor WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'
import {
  ArrowLeft,
  FileUp,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

type ResumeUploadPageProps = {
  onBack: () => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['application/pdf']

export default function ResumeUploadPage({
  onBack,
}: ResumeUploadPageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  function validateFile(file: File) {
    setError('')

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please select a PDF file.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Your resume must be 5 MB or smaller.')
      return
    }

    setSelectedFile(file)
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (file) validateFile(file)
    event.target.value = ''
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files[0]

    if (file) validateFile(file)
  }

  function removeFile() {
    setSelectedFile(null)
    setError('')
  }

  return (
    <section className="mx-auto max-w-3xl py-4 sm:py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#292D29] px-3 py-2 text-sm text-[#A1A7A1] transition-colors hover:bg-[#191C19] hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to options
      </button>

      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#24442F] bg-[#14251B]">
          <FileUp size={23} className="text-[#00E676]" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#00E676]">
          Start with what you have
        </p>

        <h2 className="text-3xl font-bold tracking-tight">
          Upload your resume.
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#A1A7A1]">
          Choose your existing resume to get started. Later, PrepPilot
          will use it to help build your career profile and identify
          relevant skills and experience.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="rounded-2xl border border-dashed border-[#454B45] bg-[#111311] p-6 text-center sm:p-10"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#292D29] bg-[#191C19]">
          <FileUp size={26} className="text-[#00E676]" />
        </div>

        <h3 className="text-base font-semibold">
          Drop your resume here
        </h3>

        <p className="mt-2 text-sm text-[#858B85]">
          or select a file from your device
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Choose a PDF resume"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#454B45] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#202320]"
        >
          <FileText size={16} />
          Choose PDF
        </button>

        <p className="mt-4 text-xs text-[#777D77]">
          PDF only · Maximum file size: 5 MB
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-900/60 bg-red-950/20 p-3 text-sm text-red-300"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {selectedFile && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#285238] bg-[#142019] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B3022]">
            <FileText size={20} className="text-[#00E676]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {selectedFile.name}
            </p>
            <p className="mt-1 text-xs text-[#858B85]">
              {(selectedFile.size / 1024).toFixed(0)} KB · Selected locally
            </p>
          </div>

          <CheckCircle2 size={19} className="shrink-0 text-[#00E676]" />

          <button
            type="button"
            onClick={removeFile}
            aria-label="Remove selected resume"
            className="rounded-lg p-2 text-[#A1A7A1] hover:bg-[#202320]"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-[#292D29] bg-[#111311] p-4">
        <p className="text-sm font-medium">Your resume, your choice</p>
        <p className="mt-1 text-sm leading-6 text-[#858B85]">
          The file is only selected in your browser at this stage.
          It is not uploaded to a server or saved by PrepPilot yet.
        </p>
      </div>

      <div className="mt-6 border-t border-[#292D29] pt-5">
        <button
          type="button"
          disabled={!selectedFile}
          onClick={() => {
            // Resume processing will be connected to the backend later.
          }}
          className="w-full rounded-lg bg-[#00E676] px-5 py-3 text-sm font-semibold text-[#080A09] transition-colors hover:bg-[#35F18E] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Continue
        </button>
      </div>
    </section>
  )
}

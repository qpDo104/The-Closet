'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // Assicurati che il percorso sia giusto

export default function TestConnection() {
  const [status, setStatus] = useState('Verifica in corso...')

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('clothings')
          .select('*')
          .limit(1)

        if (error) {
          throw error
        }

        setStatus('✅ Connessione a Supabase riuscita!')
      } catch (err) {
        // Qui forziamo la stampa del vero messaggio di Supabase!
        const errorMessage = err.message || JSON.stringify(err)
        console.error('Errore dettagliato:', errorMessage)
        setStatus('❌ Errore: ' + errorMessage)
      }
    }

    checkConnection()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
        <h1 className="text-xl font-bold mb-4">Stato Gemello Virtuale</h1>
        <p className={`font-mono ${status.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {status}
        </p>
      </div>
    </main>
  )
}
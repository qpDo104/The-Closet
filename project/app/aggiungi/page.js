'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient' // Percorso corretto verso la cartella lib

export default function AggiungiCapo() {
    const [loading, setLoading] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [file, setFile] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        type: 'top',
        style: 'Casual',
        color_name: '',
        color_hex: '#000000',
    })

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const handleFileChange = (e) => setFile(e.target.files[0])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            alert("Seleziona una foto del capo d'abbigliamento!")
            return
        }

        setLoading(true)

        try {
            // STEP 1: Scontorno immagine tramite Remove.bg
            setStatusText('🪄 Scontornando l\'immagine in background...')
            const bgFormData = new FormData()
            bgFormData.append('image_file', file)
            bgFormData.append('size', 'auto')

            const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: { 'X-Api-Key': process.env.NEXT_PUBLIC_REMOVEBG_KEY },
                body: bgFormData
            })

            if (!removeBgRes.ok) throw new Error('Errore durante lo scontorno di Remove.bg')

            const imageBlob = await removeBgRes.blob() // L'immagine PNG trasparente

            // STEP 2: Caricamento sul Bucket Supabase
            setStatusText('☁️ Caricamento nell\'armadio cloud...')
            const fileName = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}.png` // Forziamo estensione PNG

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('clothes')
                .upload(fileName, imageBlob, { contentType: 'image/png' })

            if (uploadError) throw uploadError

            // Otteniamo l'URL pubblico dell'immagine appena caricata
            const { data: publicUrlData } = supabase.storage.from('clothes').getPublicUrl(fileName)
            const imageUrl = publicUrlData.publicUrl

            // STEP 3: Salvataggio nel Database
            setStatusText('💾 Registrazione dei dati...')
            const { error: dbError } = await supabase
                .from('clothings')
                .insert([{
                    name: formData.name,
                    type: formData.type,
                    style: formData.style,
                    color_name: formData.color_name,
                    color_hex: formData.color_hex,
                    image_url: imageUrl,
                    is_owned: true
                }])

            if (dbError) throw dbError

            alert('✅ Capo aggiunto al tuo armadio e pronto per essere indossato!')

            // Reset del form
            setFormData({ name: '', type: 'top', style: 'Casual', color_name: '', color_hex: '#000000' })
            setFile(null)
            document.getElementById('fileUpload').value = ''

        } catch (err) {
            console.error(err)
            alert('❌ Errore: ' + err.message)
        } finally {
            setLoading(false)
            setStatusText('')
        }
    }

    return (
        <div className="home-wrapper" style={{ overflowY: 'auto', padding: '2rem 0' }}>
            <div className="form-container">
                <div className="form-header">
                    <h1>Nuovo Capo</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Il nostro algoritmo rimuoverà automaticamente lo sfondo dalla tua foto.</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group full-width" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Foto del capo</label>
                        <input type="file" id="fileUpload" accept="image/*" onChange={handleFileChange} className="form-input file-input" required />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Nome Capo</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Es. T-Shirt Nike Nera" className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Categoria</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                                <option value="top">Top (Maglie, Felpe, Giacche)</option>
                                <option value="bottom">Bottom (Pantaloni, Jeans)</option>
                                <option value="shoes">Scarpe</option>
                                <option value="accessory">Accessori</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Stile</label>
                            <select name="style" value={formData.style} onChange={handleChange} className="form-select">
                                <option value="Casual">Casual</option>
                                <option value="Streetwear">Streetwear</option>
                                <option value="Elegant">Elegante</option>
                                <option value="Sporty">Sportivo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Colore Principale (Nome)</label>
                            <input type="text" name="color_name" value={formData.color_name} onChange={handleChange} placeholder="Es. Nero" className="form-input" required />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Colore Esatto (HEX)</label>
                            <div className="color-preview">
                                <input type="color" name="color_hex" value={formData.color_hex} onChange={handleChange} className="color-picker" />
                                <span style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}>{formData.color_hex}</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? statusText : 'Aggiungi all\'Armadio'}
                    </button>
                </form>
            </div>
        </div>
    )
}
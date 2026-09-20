import React from 'react';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface QuoteTabProps {
  quote: string;
  blessing: string;
  onChangeQuote: (q: string) => void;
  onChangeBlessing: (b: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const PRESET_QUOTES = [
  {
    label: 'QS. Ar-Rum: 21 (Islami)',
    text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang..." (QS. Ar-Rum: 21)',
  },
  {
    label: '1 Korintus 13: 4-7 (Kristiani)',
    text: '"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Kasih menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu."',
  },
  {
    label: 'Puisi Cinta Romantis',
    text: '"Cinta bukan tentang mencari orang yang sempurna, melainkan belajar melihat orang yang tidak sempurna dengan cara yang sempurna."',
  },
];

export function QuoteTab({
  quote,
  blessing,
  onChangeQuote,
  onChangeBlessing,
  showToast,
}: QuoteTabProps) {
  const handleApplyPreset = (presetText: string) => {
    onChangeQuote(presetText);
    showToast('Template kutipan berhasil diterapkan!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Kutipan / Ayat Suci */}
      <Card>
        <SectionHead
          title="Kutipan Suci / Kata Mutiara"
          sub="Tampil di bagian pembuka undangan sebagai landasan cinta pernikahan"
        />

        <div className="space-y-3.5">
          <M3Field
            label="Teks Kutipan / Ayat"
            placeholder="Tuliskan ayat suci atau kutipan romantis..."
            value={quote}
            onChange={onChangeQuote}
            multiline
            rows={4}
            required
          />

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-on-surface">Pilihan Template Kutipan Populer:</span>
            <div className="flex flex-col gap-2">
              {PRESET_QUOTES.map((pq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(pq.text)}
                  className="p-3 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-left transition-all group"
                >
                  <span className="text-xs font-bold text-primary group-hover:underline block mb-0.5">
                    {pq.label}
                  </span>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 italic">{pq.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Pesan Sambutan & Doa Penutup */}
      <Card>
        <SectionHead
          title="Pesan Sambutan & Doa Restu"
          sub="Kata pembuka formal mengundang para tamu serta ungkapan rasa syukur"
        />
        <div className="space-y-3.5">
          <M3Field
            label="Salam & Kata Pengantar Undangan"
            placeholder="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir..."
            value={blessing}
            onChange={onChangeBlessing}
            multiline
            rows={3}
          />
        </div>
      </Card>
    </div>
  );
}

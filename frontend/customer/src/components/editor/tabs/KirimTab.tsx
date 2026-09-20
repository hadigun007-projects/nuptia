import React, { useState } from 'react';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface KirimTabProps {
  title: string;
  slug: string;
  groomNick: string;
  brideNick: string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const MESSAGE_TEMPLATES = [
  {
    id: 'formal',
    name: 'Formal & Santun',
    desc: 'Cocok untuk pimpinan, kolega kerja, dan keluarga yang lebih tua',
  },
  {
    id: 'casual',
    name: 'Hangat & Sahabat',
    desc: 'Bahasa akrab untuk teman kuliah, teman sekolah, dan sahabat dekat',
  },
  {
    id: 'simple',
    name: 'Singkat & Padat',
    desc: 'Pesan cepat langsung menuju link undangan',
  },
];

export function KirimTab({
  title,
  slug,
  groomNick,
  brideNick,
  showToast,
}: KirimTabProps) {
  const [guestName, setGuestName] = useState('Sahabatku Dimas');
  const [selectedTemplate, setSelectedTemplate] = useState('formal');

  const guestSlug = encodeURIComponent(guestName);
  const inviteUrl = `${window.location.origin}/#/${slug}?to=${guestSlug}`;

  const generateMessageText = () => {
    if (selectedTemplate === 'formal') {
      return `Kepada Yth.\nBapak/Ibu/Saudara/i: *${guestName}*\n\nAssalamu’alaikum Warahmatullahi Wabarakatuh,\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami:\n\n*${groomNick} & ${brideNick}*\n\nDetail acara dan konfirmasi kehadiran dapat diakses melalui link undangan berikut:\n${inviteUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir.\n\nTerima kasih,\nWassalamu’alaikum Wr. Wb.\n*${groomNick} & ${brideNick}*`;
    }

    if (selectedTemplate === 'casual') {
      return `Hai *${guestName}*! ✨\n\nKabar bahagia dari kami! Dengan penuh rasa syukur, kami mengundangmu untuk merayakan hari pernikahan kami:\n\n💍 *${groomNick} & ${brideNick}*\n\nYuk buka undangan digital dan konfirmasi kehadiranmu di sini:\n${inviteUrl}\n\nKehadiran dan doa restumu sangat berarti untuk kami berdua. Sampai jumpa di hari bahagia ya!\n\nSalam hangat,\n*${groomNick} & ${brideNick}*`;
    }

    return `Undangan Pernikahan *${groomNick} & ${brideNick}*\n\nKepada: *${guestName}*\n\nSilakan buka link berikut untuk info lengkap dan konfirmasi kehadiran:\n${inviteUrl}\n\nTerima kasih!`;
  };

  const messageText = generateMessageText();

  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText);
    }
    showToast('Teks pesan WhatsApp berhasil disalin!', 'success');
  };

  const handleCopyLinkOnly = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
    }
    showToast('Link undangan khusus berhasil disalin!', 'success');
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pengantar Generator */}
      <Card>
        <SectionHead
          title="Kirim Undangan via WhatsApp (1-Klik)"
          sub="Buat pesan WhatsApp terpersonalisasi dengan sapaan khusus kepada setiap tamu"
        />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Nama tamu undangan akan otomatis tertera di pintu depan undangan digital. Tamu akan merasa sangat
          dihargai dengan sapaan personal hangat.
        </p>
      </Card>

      {/* Personalisasi Nama Tamu */}
      <Card>
        <SectionHead
          title="Nama Tamu Yang Dituju"
          sub="Ketik nama tamu undangan yang ingin kamu kirimi pesan"
        />
        <div className="space-y-3.5">
          <M3Field
            label="Nama Tamu (Kepada Yth.)"
            placeholder="Contoh: Bpk. Ir. Hendro & Keluarga"
            value={guestName}
            onChange={setGuestName}
            required
          />

          <div>
            <span className="text-xs font-bold text-on-surface mb-2 block">Pilihan Gaya Pesan:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {MESSAGE_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-container/30 ring-1 ring-primary font-bold'
                        : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <p className="text-xs text-on-surface font-display">{tpl.name}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">{tpl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Pesan & Tombol Kirim */}
      <Card>
        <SectionHead
          title="Preview Pesan WhatsApp Siap Sebar"
          sub="Tinjau tampilan pesan sebelum dikirimkan ke WhatsApp"
        />

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#DDD4CA] font-sans text-xs text-[#111B21] whitespace-pre-line leading-relaxed">
            {messageText}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all"
            >
              <Ic.Kirim s={18} cls="text-amber-300" />
              <span>Buka WhatsApp & Kirim</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs border border-outline-variant/40 transition-colors"
            >
              <Ic.Copy s={15} />
              <span>Salin Teks Lengkap</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLinkOnly}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs border border-outline-variant/40 transition-colors"
            >
              <Ic.ExternalLink s={15} />
              <span>Salin Link Saja</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

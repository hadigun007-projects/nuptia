import React from 'react';
import { EventData } from '../../../types';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';

interface EventDetailsTabProps {
  data: EventData;
  onChange: (d: EventData) => void;
}

export function EventDetailsTab({ data, onChange }: EventDetailsTabProps) {
  const set = (k: keyof EventData) => (v: string) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-5 animate-fade-in-up">
      <Card>
        <SectionHead title="Nama Pasangan" sub="Nama panggilan ditampilkan besar di undangan" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <M3Field
            label="Nama Panggilan Pria"
            value={data.groomNick}
            onChange={set('groomNick')}
            placeholder="Contoh: Reza"
            required
          />
          <M3Field
            label="Nama Panggilan Wanita"
            value={data.brideNick}
            onChange={set('brideNick')}
            placeholder="Contoh: Hana"
            required
          />
          <M3Field label="Nama Lengkap Pria" value={data.groomFull} onChange={set('groomFull')} />
          <M3Field label="Nama Lengkap Wanita" value={data.brideFull} onChange={set('brideFull')} />
          <M3Field label="Nama Orang Tua Pria" value={data.groomParents} onChange={set('groomParents')} />
          <M3Field label="Nama Orang Tua Wanita" value={data.brideParents} onChange={set('brideParents')} />
        </div>
      </Card>

      <Card>
        <SectionHead title="Waktu & Tanggal Acara" sub="Jadwal rangkaian akad nikah dan resepsi" />
        <div className="space-y-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Akad Nikah</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <M3Field label="Tanggal Akad" value={data.akadDate} onChange={set('akadDate')} type="date" />
            <M3Field label="Jam Akad" value={data.akadTime} onChange={set('akadTime')} type="time" />
          </div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider pt-1">Resepsi Pernikahan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <M3Field label="Tanggal Resepsi" value={data.resepsiDate} onChange={set('resepsiDate')} type="date" />
            <M3Field label="Jam Resepsi" value={data.resepsiTime} onChange={set('resepsiTime')} type="time" />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHead title="Lokasi & Venue" sub="Alamat lengkap dan rute Google Maps" />
        <div className="space-y-3">
          <M3Field label="Nama Gedung / Venue" value={data.venue} onChange={set('venue')} />
          <M3Field label="Alamat Lengkap" value={data.address} onChange={set('address')} multiline rows={2} />
          <M3Field
            label="Link Google Maps"
            value={data.mapsUrl}
            onChange={set('mapsUrl')}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </Card>

      <Card>
        <SectionHead title="Pesan & Doa" sub="Kutipan suci atau kata sambutan di undangan" />
        <div className="space-y-3">
          <M3Field
            label="Kutipan / Quote Pembuka"
            value={data.quote}
            onChange={set('quote')}
            multiline
            rows={4}
          />
          <M3Field
            label="Pesan Undangan"
            value={data.blessing}
            onChange={set('blessing')}
            multiline
            rows={3}
          />
        </div>
      </Card>
    </div>
  );
}

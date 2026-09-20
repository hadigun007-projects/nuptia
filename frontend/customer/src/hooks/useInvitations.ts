import { useState, useEffect, useCallback } from 'react';
import { Invitation, CreateInvitationInput, Status } from '../types';
import { INITIAL_INVITATIONS, TEMPLATE_OPTIONS } from '../data/seedData';

const STORAGE_KEY = 'nuptia_customer_invitations_v1';

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load invitations from localStorage', err);
    }
    return INITIAL_INVITATIONS;
  });

  // Persist to localStorage whenever invitations change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
    } catch (err) {
      console.error('Failed to save invitations to localStorage', err);
    }
  }, [invitations]);

  const getInvitation = useCallback(
    (id: string) => {
      return invitations.find((inv) => inv.id === id);
    },
    [invitations]
  );

  const createInvitation = useCallback((input: CreateInvitationInput): Invitation => {
    const id = `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const slug = `${input.groomNick.toLowerCase().trim()}-dan-${input.brideNick.toLowerCase().trim()}`
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    
    const chosenTemplate =
      TEMPLATE_OPTIONS.find((t) => t.id === input.templateId) || TEMPLATE_OPTIONS[0];

    const newInvitation: Invitation = {
      id,
      slug: slug || `undangan-${Date.now()}`,
      title: `${input.groomNick} & ${input.brideNick}`,
      templateId: chosenTemplate.id,
      templateName: chosenTemplate.name,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        views: 0,
        rsvpAttending: 0,
        rsvpTotal: 0,
        greetingsCount: 0,
      },
      event: {
        groomNick: input.groomNick,
        brideNick: input.brideNick,
        groomFull: `${input.groomNick} Pratama`,
        brideFull: `${input.brideNick} Putri`,
        groomParents: 'Bpk. & Ibu Mempelai Pria',
        brideParents: 'Bpk. & Ibu Mempelai Wanita',
        akadDate: input.weddingDate || new Date().toISOString().split('T')[0],
        akadTime: '08:00',
        resepsiDate: input.weddingDate || new Date().toISOString().split('T')[0],
        resepsiTime: '11:00',
        venue: 'Nama Gedung / Tempat Acara',
        address: 'Alamat lengkap tempat pelaksanaan pernikahan',
        mapsUrl: 'https://maps.google.com',
        quote: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..." (QS. Ar-Rum: 21)',
        blessing: 'Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.',
      },
      media: {
        heroUrl: chosenTemplate.cover,
        gallery: [
          {
            id: '1',
            url: chosenTemplate.cover,
            caption: 'Momen Bahagia Kami',
            loading: false,
          },
        ],
        videoUrl: '',
        musicTitle: 'A Thousand Years – Christina Perri',
        musicPlaying: false,
      },
      guests: {
        rsvpEnabled: true,
        greetingsEnabled: true,
        bankName: 'Bank Central Asia (BCA)',
        accountNo: '',
        accountHolder: input.groomNick,
        ewalletType: 'GoPay',
        ewalletNo: '',
        ewalletName: input.brideNick,
        physicalGiftEnabled: false,
      },
      loveStory: [],
      streaming: {
        enabled: false,
        platform: 'youtube',
        url: '',
        scheduleDate: input.weddingDate || '',
        scheduleTime: '08:00 WIB',
      },
      social: {
        igFilterUrl: '',
        hashtag: `#${input.groomNick}${input.brideNick}Menikah`,
        igGroom: '',
        igBride: '',
      },
      guestBook: [],
      greetingsList: [],
      settings: {
        customSlug: slug || `undangan-${Date.now()}`,
        isPrivate: false,
        password: '',
        searchEngineIndex: true,
        musicAutoplay: true,
      },
      theme: {
        templateId: chosenTemplate.id,
        templateName: chosenTemplate.name,
        primaryColor: chosenTemplate.color,
        fontStyle: 'Nunito & Inter',
      },
    };

    setInvitations((prev) => [newInvitation, ...prev]);
    return newInvitation;
  }, []);

  const createBlankInvitation = useCallback((templateId?: string): Invitation => {
    const id = `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const chosenTemplate =
      TEMPLATE_OPTIONS.find((t) => t.id === templateId) || TEMPLATE_OPTIONS[0];

    const newInvitation: Invitation = {
      id,
      slug: `undangan-${Date.now().toString(36)}`,
      title: 'Undangan Baru',
      templateId: chosenTemplate.id,
      templateName: chosenTemplate.name,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        views: 0,
        rsvpAttending: 0,
        rsvpTotal: 0,
        greetingsCount: 0,
      },
      event: {
        groomNick: '',
        brideNick: '',
        groomFull: '',
        brideFull: '',
        groomParents: '',
        brideParents: '',
        groomPhoto: '',
        bridePhoto: '',
        groomInstagram: '',
        brideInstagram: '',
        groomBio: '',
        brideBio: '',
        akadDate: '',
        akadTime: '08:00',
        resepsiDate: '',
        resepsiTime: '11:00',
        venue: '',
        address: '',
        mapsUrl: '',
        quote: '',
        blessing: '',
        sessions: [],
      },
      media: {
        heroUrl: chosenTemplate.cover,
        gallery: [],
        videoUrl: '',
        musicTitle: '',
        musicPlaying: false,
      },
      guests: {
        rsvpEnabled: true,
        greetingsEnabled: true,
        bankName: 'Bank Central Asia (BCA)',
        accountNo: '',
        accountHolder: '',
        ewalletType: 'GoPay',
        ewalletNo: '',
        ewalletName: '',
        physicalGiftEnabled: false,
      },
      loveStory: [],
      streaming: {
        enabled: false,
        platform: 'youtube',
        url: '',
        scheduleDate: '',
        scheduleTime: '08:00 WIB',
      },
      social: {
        igFilterUrl: '',
        hashtag: '',
        igGroom: '',
        igBride: '',
      },
      guestBook: [],
      greetingsList: [],
      settings: {
        customSlug: `undangan-${Date.now().toString(36)}`,
        isPrivate: false,
        password: '',
        searchEngineIndex: true,
        musicAutoplay: false,
      },
      theme: {
        templateId: chosenTemplate.id,
        templateName: chosenTemplate.name,
        primaryColor: chosenTemplate.color,
        fontStyle: 'Nunito & Inter',
      },
    };

    setInvitations((prev) => [newInvitation, ...prev]);
    return newInvitation;
  }, []);

  const updateInvitation = useCallback((id: string, updates: Partial<Invitation>) => {
    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        return {
          ...inv,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateInvitationStatus = useCallback((id: string, status: Status) => {
    updateInvitation(id, { status });
  }, [updateInvitation]);

  const duplicateInvitation = useCallback((id: string): Invitation | undefined => {
    let duplicated: Invitation | undefined;
    setInvitations((prev) => {
      const original = prev.find((inv) => inv.id === id);
      if (!original) return prev;

      const newId = `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      duplicated = {
        ...original,
        id: newId,
        slug: `${original.slug}-copy`,
        title: `${original.title} (Salinan)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          views: 0,
          rsvpAttending: 0,
          rsvpTotal: 0,
          greetingsCount: 0,
        },
      };
      return [duplicated, ...prev];
    });
    return duplicated;
  }, []);

  const deleteInvitation = useCallback((id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  return {
    invitations,
    getInvitation,
    createInvitation,
    createBlankInvitation,
    updateInvitation,
    updateInvitationStatus,
    duplicateInvitation,
    deleteInvitation,
  };
}

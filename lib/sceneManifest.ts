// Structured Scene Manifest based on verified frame inspection:
// Video Asset: Luxury_Home_3D_Walkthrough_in_4K___Real_Estate_Marketing_Video_4K_60FPS_.webm
// Total Duration: ~46.8s (We map scroll progression from 0 to 42s to keep it focused on property architecture)

export interface SceneMarker {
  time: number; // Video timestamp in seconds
  progress: number; // Normalized scroll progress (0 to 1)
  sceneTag: string;
  title: string;
  subtitle: string;
  description: string;
  metrics?: { label: string; value: string };
  alignment: 'center' | 'left' | 'right';
}

export const SCENE_MANIFEST: SceneMarker[] = [
  {
    time: 1.5,
    progress: 0.05,
    sceneTag: 'ARCHITECTURAL EXTERIOR',
    title: 'The Art of Arrival',
    subtitle: 'MODERN RESIDENTIAL ELEGANCE',
    description: 'Imposing dual-wing architecture with natural limestone finishes, floor-to-ceiling glass pavilions, and grand motor court.',
    metrics: { label: 'Private Grounds', value: '1.2 Acres' },
    alignment: 'center',
  },
  {
    time: 11.5,
    progress: 0.28,
    sceneTag: 'AQUATIC OASIS',
    title: 'Water & Light Harmony',
    subtitle: 'REFLECTION & RECREATION',
    description: 'Serene infinity reflection pool featuring synchronized hydro-fountains, expansive travertine sun deck, and manicured private lawn.',
    metrics: { label: 'Pool Dimensions', value: '50 ft Lap' },
    alignment: 'left',
  },
  {
    time: 23.5,
    progress: 0.55,
    sceneTag: 'CURATED INTERIORS',
    title: 'Sculpted Living Spaces',
    subtitle: 'WARM MINIMALISM',
    description: 'Open-concept great room with exposed white-oak timber beams, architectural floating steel staircase, and bespoke floor-to-ceiling cabinetry.',
    metrics: { label: 'Ceiling Clearance', value: '18 ft Double Height' },
    alignment: 'right',
  },
  {
    time: 35.5,
    progress: 0.78,
    sceneTag: 'MASTER BATH RETREAT',
    title: 'Private Wellness Sanctuary',
    subtitle: 'MARBLE CRAFTSMANSHIP',
    description: 'Freestanding solid-surface soaking tub, bookmatched Italian Nero Marquina marble, concealed rain showers, and brushed brass fixtures.',
    metrics: { label: 'Spa Amenities', value: 'Heated Towel & Rain Spa' },
    alignment: 'left',
  },
  {
    time: 40.5,
    progress: 0.95,
    sceneTag: 'CHEF & ENTERTAINMENT SUITE',
    title: 'Epicurean Gathering',
    subtitle: 'CULINARY EXCELLENCE',
    description: 'Expansive waterfall marble kitchen island, integrated Sub-Zero & Wolf appliances, bespoke sommelier bar, and luminous living salon.',
    metrics: { label: 'Entertaining Capacity', value: '30+ Guests' },
    alignment: 'center',
  },
];

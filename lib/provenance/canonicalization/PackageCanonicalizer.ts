/**
 * PackageCanonicalizer
 * Specialized canonicalizers for complex generated packages:
 * - VideoPackage (script, storyboard, narration, subtitles, visual recs)
 * - PresentationPackage (title, slide order, slide titles, slide content, speaker notes)
 * - InfographicPackage (headline, key messaging, sections, statistics, layout, visual recs)
 * 
 * Rules:
 * Excludes volatile metadata (temporary IDs, timestamps, UI state, request tokens).
 * Preserves semantic order and structured content deterministically.
 */

import { StructuredContentCanonicalizer } from './StructuredContentCanonicalizer';
import { TextCanonicalizer } from './TextCanonicalizer';

export class PackageCanonicalizer {
  private static readonly VOLATILE_KEYS = [
    'id',
    '_id',
    'createdAt',
    'updatedAt',
    'timestamp',
    'requestId',
    'processingTime',
    'uiState',
    'isExpanded',
    'isActive',
    'selected',
    'tempId',
  ];

  /**
   * Canonicalizes Video Content Package
   */
  public static canonicalizeVideoPackage(data: any): string {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return TextCanonicalizer.canonicalize(data);
      }
    }

    const canonicalStructure = {
      type: 'video_package',
      title: data.concept?.title || data.title || '',
      hook: data.concept?.hook || data.hook || '',
      audience: data.concept?.targetAudience || data.audience || '',
      objective: data.concept?.objective || data.objective || '',
      duration: data.concept?.recommendedDuration || data.duration || '',
      tone: data.concept?.tone || data.tone || '',
      script: typeof data.script === 'object' ? data.script?.fullText || '' : data.script || '',
      storyboard: Array.isArray(data.storyboard)
        ? data.storyboard.map((scene: any) => ({
            sceneNumber: scene.sceneNumber,
            narration: scene.narration || '',
            visual: scene.visual || '',
            onScreenText: scene.onScreenText || '',
            cameraFraming: scene.cameraFraming || '',
            transition: scene.transition || '',
          }))
        : [],
      narration: Array.isArray(data.narration)
        ? data.narration.map((n: any) => ({
            sceneNumber: n.sceneNumber,
            text: n.text || '',
            timing: n.timing || '',
          }))
        : typeof data.narration === 'string'
        ? data.narration
        : [],
      subtitles: Array.isArray(data.subtitles)
        ? data.subtitles.map((s: any) => ({
            start: s.start,
            end: s.end,
            text: s.text || '',
          }))
        : typeof data.subtitles === 'string'
        ? data.subtitles
        : [],
      visualRecommendations: Array.isArray(data.visualRecommendations || data.visualRecs)
        ? (data.visualRecommendations || data.visualRecs).map((v: any) => ({
            type: v.type || '',
            description: v.description || '',
          }))
        : [],
    };

    return StructuredContentCanonicalizer.canonicalize(canonicalStructure, this.VOLATILE_KEYS);
  }

  /**
   * Canonicalizes Presentation Content Package
   */
  public static canonicalizePresentationPackage(data: any): string {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return TextCanonicalizer.canonicalize(data);
      }
    }

    const canonicalStructure = {
      type: 'presentation_package',
      title: data.metadata?.title || data.title || '',
      subtitle: data.metadata?.subtitle || data.subtitle || '',
      audience: data.metadata?.targetAudience || data.audience || '',
      objective: data.metadata?.presentationObjective || data.objective || '',
      slides: Array.isArray(data.slides)
        ? data.slides.map((s: any) => ({
            slideNumber: s.slideNumber,
            title: s.title || '',
            mainContent: s.mainContent || '',
            bulletPoints: Array.isArray(s.bulletPoints) ? s.bulletPoints : [],
            speakerNotes: s.speakerNotes || '',
            layoutRecommendation: s.layoutRecommendation || '',
            visualRecommendation: s.visualRecommendation || '',
          }))
        : typeof data.slides === 'string'
        ? JSON.parse(data.slides)
        : [],
      structure: Array.isArray(data.structure) ? data.structure : [],
    };

    return StructuredContentCanonicalizer.canonicalize(canonicalStructure, this.VOLATILE_KEYS);
  }

  /**
   * Canonicalizes Infographic Content Package
   */
  public static canonicalizeInfographicPackage(data: any): string {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return TextCanonicalizer.canonicalize(data);
      }
    }

    const canonicalStructure = {
      type: 'infographic_package',
      headline: data.mainMessage?.headline || data.headline || '',
      subheadline: data.mainMessage?.subheadline || data.subheadline || '',
      takeaway: data.mainMessage?.coreTakeaway || data.takeaway || '',
      keyMessages: Array.isArray(data.keyMessages)
        ? data.keyMessages
        : typeof data.keyMessages === 'string'
        ? JSON.parse(data.keyMessages)
        : [],
      statistics: Array.isArray(data.statistics)
        ? data.statistics.map((st: any) => ({
            metric: st.metric || '',
            value: st.value || '',
            label: st.label || '',
          }))
        : typeof data.statistics === 'string'
        ? JSON.parse(data.statistics)
        : [],
      sections: Array.isArray(data.sections)
        ? data.sections.map((sec: any) => ({
            sectionTitle: sec.sectionTitle || '',
            sectionType: sec.sectionType || '',
            content: sec.content || '',
            stat: sec.stat || null,
          }))
        : typeof data.sections === 'string'
        ? JSON.parse(data.sections)
        : [],
      layoutRecommendations: data.layoutRecommendations || data.layoutRecs || null,
      visualRecommendations: data.visualRecommendations || data.visualRecs || null,
    };

    return StructuredContentCanonicalizer.canonicalize(canonicalStructure, this.VOLATILE_KEYS);
  }
}

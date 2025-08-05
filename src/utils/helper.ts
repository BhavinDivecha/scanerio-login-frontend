export interface Violation {
  id: string;
  rule: string;
  level: string;
  severity: string;
  description: string;
  element: {
    name: string;
    type: string;
    location: string;
    selector: string;
    html: string;
  };
  contrast?: {
    currentRatio: string;
    requiredRatio: string;
    foreground: string;
    background: string;
  };
  impact: string;
  solution: {
    suggestion: string;
    options: string[];
  };
  resources: {
    helpUrl: string;
    wcagReference: string;
  };
}

export interface WebsiteViolations {
  url: string;
  violations: {
    [key: string]: {
      id: string;
      title: string;
      severity: string;
      level: string;
      description: string;
      wcag: string;
      helpUrl: string;
      occurrences: Violation[];
    };
  };
  summary: {
    totalViolations: number;
    bySeverity: {
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
    byWCAGLevel: {
      AA: number;
      A: number;
      BestPractice: number;
    };
    byCategory: {
      [key: string]: number;
    };
  };
}

export const API_URL=`${process.env.NEXT_PUBLIC_API_URL}`;

export function transformViolations(apiResponse: any): WebsiteViolations {
  const violationsByType: Record<string, any> = {};
  let criticalCount = 0;
  let seriousCount = 0;
  let moderateCount = 0;
  let minorCount = 0;
  let aaCount = 0;
  let aCount = 0;
  let bestPracticeCount = 0;
  const categoryCounts: Record<string, number> = {};

  for (let i = 0; i < apiResponse.violations.length; i++) {
    const violation = apiResponse.violations[i];
    
    // Count severity levels
    switch (violation.impact) {
      case 'critical': criticalCount++; break;
      case 'serious': seriousCount++; break;
      case 'moderate': moderateCount++; break;
      case 'minor': minorCount++; break;
    }

    // Count WCAG levels
    if (violation.tags.includes('wcag2aa')) aaCount++;
    else if (violation.tags.includes('wcag2a')) aCount++;
    else bestPracticeCount++;

    // Count categories
    const category = violation.tags.find((tag: string) => tag.startsWith('cat.')) || 'other';
    const categoryName = category.replace('cat.', '').replace('-', ' ');
    categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;

    // Process each node in the violation
    for (let j = 0; j < violation.nodes.length; j++) {
      const node = violation.nodes[j];
      const violationKey = `${violation.id}-${j}`;
      const isColorContrast = violation.id === 'color-contrast';
      
      const newViolation: Violation = {
        id: `${apiResponse.jobId}-${violationKey}`,
        rule: violation.id,
        level: violation.tags.includes('wcag2aa') ? 'AA' : 
              violation.tags.includes('wcag2a') ? 'A' : 'Best Practice',
        severity: violation.impact,
        description: violation.description,
        element: {
          name: node.html.match(/<([a-z][a-z0-9]*)[^>]*>/i)?.[1] || 'element',
          type: node.html.startsWith('<a') ? 'link' : 
                node.html.startsWith('<button') ? 'button' :
                node.html.startsWith('<h') ? 'heading' : 'element',
          location: node.target?.join(', ') || 'unknown',
          selector: node.target?.join(' ') || node.failureSummary?.split('\n')[0] || 'unknown',
          html: node.html
        },
        impact: node.failureSummary || violation.help,
        solution: {
          suggestion: isColorContrast 
            ? `Increase contrast ratio to at least ${node.any?.[0]?.data?.expectedContrastRatio || '4.5:1'}`
            : violation.help,
          options: isColorContrast
            ? [
                `Change foreground color (${node.any?.[0]?.data?.fgColor})`,
                `Change background color (${node.any?.[0]?.data?.bgColor})`,
                'Increase font weight',
                'Increase font size'
              ]
            : [
                'Add visible text content',
                'Add ARIA labels',
                'Ensure proper heading hierarchy',
                'Add non-color visual indicators'
              ]
        },
        resources: {
          helpUrl: violation.helpUrl,
          wcagReference: violation.tags
            .filter((tag: string) => tag.startsWith('wcag') || tag === 'section508')
            .join(', ')
        }
      };

      if (isColorContrast && node.any?.[0]?.data) {
        newViolation.contrast = {
          currentRatio: node.any[0].data.contrastRatio.toFixed(2) + ':1',
          requiredRatio: node.any[0].data.expectedContrastRatio || '4.5:1',
          foreground: node.any[0].data.fgColor,
          background: node.any[0].data.bgColor
        };
      }

      if (!violationsByType[violation.id]) {
        violationsByType[violation.id] = {
          id: violation.id,
          title: violation.id.split('-').map((word:string) => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          severity: violation.impact,
          level: violation.tags.includes('wcag2aa') ? 'AA' : 
                violation.tags.includes('wcag2a') ? 'A' : 'Best Practice',
          description: violation.description,
          wcag: violation.tags
            .filter((tag: string) => tag.startsWith('wcag') || tag === 'section508')
            .map((tag: string) => {
              if (tag === 'wcag2aa') return 'WCAG 2.1 AA';
              if (tag === 'wcag2a') return 'WCAG 2.1 A';
              return tag;
            })
            .join(', '),
          helpUrl: violation.helpUrl,
          occurrences: []
        };
      }

      violationsByType[violation.id].occurrences.push(newViolation);
    }
  }

  return {
    url: apiResponse.url,
    violations: violationsByType,
    summary: {
      totalViolations: apiResponse.violations.reduce((sum: number, v: any) => sum + v.nodes.length, 0),
      bySeverity: {
        critical: criticalCount,
        serious: seriousCount,
        moderate: moderateCount,
        minor: minorCount
      },
      byWCAGLevel: {
        AA: aaCount,
        A: aCount,
        BestPractice: bestPracticeCount
      },
      byCategory: categoryCounts
    }
  };
}

// Usage example:
// const transformedData = transformViolations(apiResponse);
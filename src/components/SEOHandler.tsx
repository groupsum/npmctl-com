/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

interface SEOHandlerProps {
  route: string;
}

export default function SEOHandler({ route }: SEOHandlerProps) {
  useEffect(() => {
    let title = 'npmctl — GitOps for Nginx Proxy Manager';
    let description = 'Declare Nginx Proxy Manager (NPM) resources in YAML, review owner-scoped plans, and apply safe reconciles with an open-source Python CLI.';
    let canonical = 'https://npmctl.com/';

    switch (route) {
      case 'product':
        title = 'Product Features & Resource Controllers | npmctl';
        description = 'Explore npmctl\'s supported resource models, schema checks, declarative proxy host control, audit logs, and provider-backed DNS integrations.';
        canonical = 'https://npmctl.com/#/product';
        break;
      case 'safety':
        title = 'Owner-Scoped Safety & Security Rules | npmctl';
        description = 'Learn how npmctl protects Nginx Proxy Manager. Read about owner scopes, immutability of foreign resources, unmanaged collisions, and capability checks.';
        canonical = 'https://npmctl.com/#/safety';
        break;
      case 'providers':
        title = 'Supported DNS Provider Extensions | npmctl';
        description = 'Deploy extension packages for Cloudflare, AWS Route 53, DigitalOcean, GoDaddy, and Namecheap. Reconcile DNS records in a single GitOps pipeline.';
        canonical = 'https://npmctl.com/#/providers';
        break;
      case 'docs':
        title = 'Getting Started & Documentation | npmctl';
        description = 'Install npmctl with pipx or uv. Read prerequisites and run validation, plan, dry-run, and GitOps workflows in minutes.';
        canonical = 'https://npmctl.com/#/docs';
        break;
      case 'releases':
        title = 'Release Provenance & Timeline | npmctl';
        description = 'Browse stable releases of npmctl core and provider extension packages. Track PyPI history, trusted publishing OIDC provenance, and Python ranges.';
        canonical = 'https://npmctl.com/#/releases';
        break;
      default:
        title = 'npmctl — GitOps for Nginx Proxy Manager';
        description = 'Declare Nginx Proxy Manager (NPM) resources in YAML, review owner-scoped plans, and apply safe reconciles with an open-source Python CLI.';
        canonical = 'https://npmctl.com/';
        break;
    }

    // Set standard document values
    document.title = title;

    // Update standard meta tags
    const updateMetaTag = (nameAttr: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameAttr}"]` : `meta[name="${nameAttr}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', nameAttr);
        } else {
          el.setAttribute('name', nameAttr);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    updateMetaTag('description', description);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', 'https://npmctl.com/og-image.svg', true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', 'https://npmctl.com/og-image.svg');
    updateMetaTag('twitter:card', 'summary_large_image');

    // Dynamic JSON-LD Structured Data Injection
    const scriptId = 'npmctl-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    // 1. Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://npmctl.com/#organization',
      'name': 'groupsum',
      'url': 'https://github.com/groupsum',
      'logo': 'https://npmctl.com/favicon.svg',
      'sameAs': [
        'https://github.com/groupsum/npmctl'
      ]
    };

    // 2. WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://npmctl.com/#website',
      'url': 'https://npmctl.com/',
      'name': 'npmctl',
      'description': 'GitOps controller for Nginx Proxy Manager (NPM)',
      'publisher': {
        '@id': 'https://npmctl.com/#organization'
      }
    };

    // 3. SoftwareApplication Schema
    const softwareApplicationSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': 'https://npmctl.com/#software',
      'name': 'npmctl',
      'downloadUrl': 'https://pypi.org/project/npmctl/',
      'softwareVersion': '0.3.10',
      'applicationCategory': 'DevOpsApplication',
      'operatingSystem': 'Linux, Windows, macOS (Python 3.10-3.14 dependent)',
      'license': 'https://www.apache.org/licenses/LICENSE-2.0',
      'codeRepository': 'https://github.com/groupsum/npmctl',
      'releaseNotes': 'https://github.com/groupsum/npmctl/releases',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD'
      }
    };

    // 4. SoftwareSourceCode Schema (Representing GitHub Python repository)
    const softwareSourceCodeSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      '@id': 'https://npmctl.com/#sourcecode',
      'name': 'npmctl-core',
      'codeRepository': 'https://github.com/groupsum/npmctl',
      'programmingLanguage': {
        '@type': 'ComputerLanguage',
        'name': 'Python',
        'url': 'https://www.python.org/'
      },
      'runtimePlatform': 'Python 3.10, Python 3.11, Python 3.12, Python 3.13, Python 3.14',
      'license': 'https://www.apache.org/licenses/LICENSE-2.0',
      'author': {
        '@id': 'https://npmctl.com/#organization'
      }
    };

    // 5. BreadcrumbList Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': 'https://npmctl.com/#breadcrumbs',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://npmctl.com/'
        },
        route !== 'home' ? {
          '@type': 'ListItem',
          'position': 2,
          'name': route.charAt(0).toUpperCase() + route.slice(1),
          'item': canonical
        } : null
      ].filter(Boolean)
    };

    // 6. Dynamic Page-specific schemas (TechArticles, QAPage/FAQ, HowTo)
    const extraSchemas: any[] = [];

    // General Questions & Answers (FAQ/QAPage) representing mdwrk structured safety data
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is npmctl?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'npmctl is an open-source command line tool written in Python that brings declarative GitOps workflows to Nginx Proxy Manager (NPM). It allows users to define reverse proxy hosts, SSL certificates, access lists, and DNS records in standard YAML and safely reconcile them.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How does npmctl enforce owner-scoped safety in Nginx Proxy Manager?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Every desired state YAML specifies an owner. npmctl tags reconciled resources with this ownership metadata. Any resource belonging to a different owner is strictly immutable to this instance, protecting multi-tenant configurations from accidental overwrites.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How does npmctl handle unmanaged resource collisions?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'If a proxy host defined in YAML already exists in Nginx Proxy Manager but lacks ownership metadata (usually created manually via the UI), npmctl throws an UNMANAGED COLLISION error and refuses to touch it. To manage it, the user must explicitly run the adoption command first.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Why does npmctl use deterministic exit codes in pipelines?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'To safely integrate into automated CI/CD pipelines, npmctl returns explicit exit codes: 0 for success/no-op, 1 for owner conflict or unmanaged collision, 2 for local schema validation failure, 3 for NPM API unavailability, and 4 for target capability mismatches.'
          }
        }
      ]
    };

    extraSchemas.push(faqSchema);

    // Route-specific specialized technical articles and how-to guides
    if (route === 'safety') {
      const techArticleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        '@id': 'https://npmctl.com/#safety-article',
        'headline': 'Owner-Scoped Safety & Security Rules for Nginx Proxy Manager GitOps',
        'description': 'A deep-dive technical specification explaining npmctl\'s safety-first architecture, owner tagging, and collision prevention mechanism.',
        'url': 'https://npmctl.com/#/safety',
        'inLanguage': 'en',
        'about': [
          {
            '@type': 'Thing',
            'name': 'Nginx Proxy Manager security'
          },
          {
            '@type': 'Thing',
            'name': 'GitOps pipeline safety'
          }
        ],
        'author': {
          '@id': 'https://npmctl.com/#organization'
        },
        'publisher': {
          '@id': 'https://npmctl.com/#organization'
        },
        'mainEntityOfPage': 'https://npmctl.com/#/safety',
        'dependencies': 'Nginx Proxy Manager v2.11.x, Python 3.10+'
      };
      extraSchemas.push(techArticleSchema);
    }

    if (route === 'providers') {
      const dnsProvidersArticle = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        '@id': 'https://npmctl.com/#providers-article',
        'headline': 'Declarative Multi-Cloud DNS Providers with npmctl Extensions',
        'description': 'How to deploy separate DNS record synchronization alongside reverse proxies utilizing npmctl extension packages for Cloudflare, AWS Route 53, and more.',
        'url': 'https://npmctl.com/#/providers',
        'inLanguage': 'en',
        'about': {
          '@type': 'Thing',
          'name': 'DNS Zone Management'
        },
        'author': {
          '@id': 'https://npmctl.com/#organization'
        },
        'publisher': {
          '@id': 'https://npmctl.com/#organization'
        },
        'mainEntityOfPage': 'https://npmctl.com/#/providers'
      };
      extraSchemas.push(dnsProvidersArticle);
    }

    if (route === 'docs') {
      const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        '@id': 'https://npmctl.com/#docs-howto',
        'name': 'How to Install and Deploy Nginx Proxy Manager GitOps via npmctl',
        'description': 'Step-by-step guide to installing npmctl, verifying credentials, generating dry-run plans, and applying reconciles safely.',
        'step': [
          {
            '@type': 'HowToStep',
            'position': 1,
            'name': 'Verify Prerequisites',
            'text': 'Ensure Python 3.10+ is installed and that you have API credentials for your Nginx Proxy Manager instance.'
          },
          {
            '@type': 'HowToStep',
            'position': 2,
            'name': 'Install npmctl Core and Extensions',
            'text': 'Run "pipx install npmctl" or "pipx install npmctl[cloudflare]" to isolate installation from system-level dependencies.'
          },
          {
            '@type': 'HowToStep',
            'position': 3,
            'name': 'Configure Target Connection Credentials',
            'text': 'Export NPM_URL, NPM_USERNAME, and NPM_PASSWORD to your environment shells.'
          },
          {
            '@type': 'HowToStep',
            'position': 4,
            'name': 'Perform Schema Validations & Connection Checks',
            'text': 'Execute "npmctl health" and "npmctl validate desired-state.yaml" to catch structure or OpenAPI capability errors before applying.'
          },
          {
            '@type': 'HowToStep',
            'position': 5,
            'name': 'Compute and Execute Safe Reconciles',
            'text': 'Generate owner-scoped delta plans using "npmctl plan" and execute live reconciles safely via "npmctl apply".'
          }
        ]
      };
      extraSchemas.push(howToSchema);
    }

    // Set script element text to the consolidated array of schema definitions
    scriptEl.text = JSON.stringify([
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
      softwareSourceCodeSchema,
      breadcrumbSchema,
      ...extraSchemas
    ], null, 2);

  }, [route]);

  return null;
}

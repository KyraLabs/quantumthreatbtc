import { meilisearchClient, syncResourceToMeilisearch } from '../lib/meilisearch';
import { db } from './index';
import { resources, tags } from './schema';

async function seed() {
  console.log('Seeding database...');

  const tagVocabulary = [
    { name: "Shor's Algorithm", slug: 'shors-algorithm' },
    { name: "Grover's Algorithm", slug: 'grovers-algorithm' },
    { name: 'ECDSA', slug: 'ecdsa' },
    { name: 'Schnorr', slug: 'schnorr' },
    { name: 'NIST PQC', slug: 'nist-pqc' },
    { name: 'CRYSTALS-Dilithium', slug: 'crystals-dilithium' },
    { name: 'CRYSTALS-Kyber', slug: 'crystals-kyber' },
    { name: 'FALCON', slug: 'falcon' },
    { name: 'SPHINCS+', slug: 'sphincs-plus' },
    { name: 'BIP', slug: 'bip' },
    { name: 'Taproot', slug: 'taproot' },
    { name: 'Signature Schemes', slug: 'signature-schemes' },
    { name: 'Mining Security', slug: 'mining-security' },
    { name: 'Harvest Now Decrypt Later', slug: 'harvest-now-decrypt-later' },
    { name: 'Quantum Supremacy', slug: 'quantum-supremacy' },
    { name: 'Post-Quantum', slug: 'post-quantum' },
    { name: 'Quantum Key Distribution', slug: 'quantum-key-distribution' },
  ];

  await db.insert(tags).values(tagVocabulary).onConflictDoNothing();
  console.log(`Seeded ${tagVocabulary.length} tags`);

  const resourceData = [
    {
      title: "Bitcoin's Vulnerability to Shor's Algorithm: A Timeline Analysis",
      summary:
        "Comprehensive analysis of how quantum computing threatens Bitcoin's ECDSA-based security model. Examines timeline estimates for practical quantum attacks and discusses transition strategies to post-quantum cryptography.",
      type: 'Paper',
      date: new Date('2024-03-15'),
      external_link: 'https://arxiv.org/abs/2403.12345',
      technical_level: 'Advanced',
      authors: ['Dr. Alice Quantum', 'Prof. Bob Cryptographer'],
      tags: ["Shor's Algorithm", 'ECDSA', 'Quantum Supremacy', 'Post-Quantum'],
      extras: {
        doi: '10.48550/arXiv.2403.12345',
        journal: 'Journal of Quantum Cryptography',
        peer_reviewed: true,
        citation_count: 47,
      },
    },
    {
      title: 'BIP-360: Post-Quantum Signature Scheme Integration',
      summary:
        'Proposes integrating CRYSTALS-Dilithium as optional post-quantum signature scheme in Bitcoin protocol. Includes backward compatibility analysis and migration path from ECDSA/Schnorr.',
      type: 'BIP',
      date: new Date('2025-01-20'),
      external_link: 'https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki',
      technical_level: 'Intermediate',
      authors: ['Bitcoin Core Contributors'],
      tags: ['BIP', 'CRYSTALS-Dilithium', 'Post-Quantum', 'Signature Schemes'],
      extras: {
        bip_number: '360',
        status: 'Draft',
        discussion_url: 'https://bitcointalk.org/index.php?topic=5432109.0',
      },
    },
    {
      title: 'Understanding Harvest Now, Decrypt Later Attacks',
      summary:
        'Beginner-friendly explanation of adversarial strategy to store encrypted Bitcoin transactions today and decrypt them once quantum computers become available. Discusses implications for long-term hodlers.',
      type: 'Article',
      date: new Date('2025-11-05'),
      external_link: 'https://bitcoin-magazine.com/technical/quantum-harvest-decrypt-later',
      technical_level: 'Beginner',
      authors: ['Jane Educator'],
      tags: ['Harvest Now Decrypt Later', 'Post-Quantum', 'ECDSA'],
      extras: {
        publication: 'Bitcoin Magazine',
        word_count: 2500,
        featured_image_url: 'https://example.com/images/hndl.jpg',
      },
    },
    {
      title: 'NIST Post-Quantum Cryptography Standardization: Implications for Bitcoin',
      summary:
        "Analysis of NIST's selected post-quantum algorithms (CRYSTALS-Dilithium, CRYSTALS-Kyber, FALCON, SPHINCS+) and their suitability for Bitcoin's use cases. Compares signature sizes, verification times, and security assumptions.",
      type: 'Research',
      date: new Date('2024-08-12'),
      external_link: 'https://research.example.com/nist-pqc-bitcoin',
      technical_level: 'Advanced',
      authors: ['Dr. Charlie Researcher', 'Dr. Diana Analyst'],
      tags: [
        'NIST PQC',
        'CRYSTALS-Dilithium',
        'CRYSTALS-Kyber',
        'FALCON',
        'SPHINCS+',
        'Signature Schemes',
      ],
      extras: {
        conference: 'Financial Cryptography 2024',
        presentation_slides_url: 'https://example.com/slides/nist-pqc.pdf',
      },
    },
    {
      title: "Grover's Algorithm Impact on Bitcoin Mining",
      summary:
        "Examines whether Grover's algorithm provides quadratic speedup for Bitcoin's SHA-256 mining, reducing effective security from 256 bits to 128 bits. Concludes threat is minimal compared to signature vulnerabilities.",
      type: 'Paper',
      date: new Date('2023-06-22'),
      external_link: 'https://eprint.iacr.org/2023/789',
      technical_level: 'Intermediate',
      authors: ['Prof. Eve Hashrate'],
      tags: ["Grover's Algorithm", 'Mining Security', 'Post-Quantum'],
      extras: {
        doi: '10.iacr/2023/789',
        peer_reviewed: true,
        open_access: true,
      },
    },
    {
      title: 'Taproot and Schnorr: Preparing Bitcoin for Quantum Resistance',
      summary:
        "Explores how Taproot's Schnorr signatures provide a foundation for quantum-resistant upgrades. Discusses compatibility with post-quantum signature aggregation and privacy benefits.",
      type: 'Article',
      date: new Date('2024-05-10'),
      external_link: 'https://bitcoinops.org/en/quantum-taproot-schnorr',
      technical_level: 'Intermediate',
      authors: ['Bitcoin Optech Team'],
      tags: ['Taproot', 'Schnorr', 'Post-Quantum', 'Signature Schemes'],
      extras: {
        publication: 'Bitcoin Optech',
        series: 'Quantum Resistance Series',
        part: 2,
      },
    },
    {
      title: 'SPHINCS+ Hash-Based Signatures for Bitcoin',
      summary:
        'Evaluates SPHINCS+ as a stateless hash-based signature scheme for Bitcoin. Analyzes signature size trade-offs (7.8KB-49KB depending on parameter set) and long-term security guarantees.',
      type: 'Research',
      date: new Date('2025-03-18'),
      external_link: 'https://sphincs.org/bitcoin-evaluation',
      technical_level: 'Advanced',
      authors: ['SPHINCS+ Team'],
      tags: ['SPHINCS+', 'Signature Schemes', 'Post-Quantum', 'NIST PQC'],
      extras: {
        parameter_sets: ['SPHINCS+-128s', 'SPHINCS+-256s'],
        signature_size_kb: 7.8,
      },
    },
    {
      title: 'Quantum Key Distribution: Irrelevant for Bitcoin?',
      summary:
        "Argues that quantum key distribution (QKD) does not solve Bitcoin's quantum threat because public key cryptography is used for authentication, not symmetric encryption. Clarifies common misconceptions.",
      type: 'Article',
      date: new Date('2024-11-28'),
      external_link: 'https://bitcoin-magazine.com/technical/qkd-bitcoin-misconceptions',
      technical_level: 'Beginner',
      authors: ['Michael Explainer'],
      tags: ['Quantum Key Distribution', 'Post-Quantum'],
      extras: {
        publication: 'Bitcoin Magazine',
        word_count: 1800,
      },
    },
    {
      title: 'CRYSTALS-Kyber for Bitcoin Key Encapsulation',
      summary:
        "Proposes using CRYSTALS-Kyber (NIST PQC standard for key encapsulation) for Bitcoin's potential future encrypted communication layers. Discusses use cases for Lightning Network and P2P encryption.",
      type: 'Research',
      date: new Date('2025-07-14'),
      external_link: 'https://research.kyber-bitcoin.com/kem-proposal',
      technical_level: 'Advanced',
      authors: ['Dr. Frank Security', 'Grace Developer'],
      tags: ['CRYSTALS-Kyber', 'NIST PQC', 'Post-Quantum'],
      extras: {
        use_cases: ['Lightning Network', 'P2P Encryption'],
        performance_comparison: 'vs_RSA',
      },
    },
    {
      title: 'FALCON Signatures: Compact Alternative to Dilithium',
      summary:
        'Compares FALCON and CRYSTALS-Dilithium for Bitcoin. FALCON offers smaller signatures (~600 bytes vs ~2.4KB) but slower signing. Evaluates trade-offs for different Bitcoin use cases.',
      type: 'Paper',
      date: new Date('2024-09-05'),
      external_link: 'https://falcon-sign.info/bitcoin-comparison.pdf',
      technical_level: 'Intermediate',
      authors: ['FALCON Team'],
      tags: ['FALCON', 'CRYSTALS-Dilithium', 'Signature Schemes', 'NIST PQC'],
      extras: {
        signature_size_bytes: 600,
        comparison_table: true,
      },
    },
    {
      title: 'Timeline for Economically Viable Quantum Attacks on Bitcoin',
      summary:
        "Synthesizes estimates from multiple sources on when quantum computers capable of breaking Bitcoin's ECDSA will be economically feasible. Estimates range from 2030 (optimistic) to 2050 (conservative).",
      type: 'Article',
      date: new Date('2025-04-20'),
      external_link: 'https://quantumthreat.info/bitcoin-timeline',
      technical_level: 'Beginner',
      authors: ['Timeline Research Group'],
      tags: ['Quantum Supremacy', "Shor's Algorithm", 'ECDSA'],
      extras: {
        estimate_range: '2030-2050',
        confidence_level: 'medium',
      },
    },
    {
      title: 'BIP-420: Quantum-Safe Address Format',
      summary:
        'Proposes new address format for quantum-resistant keys. Includes bech32m extension for post-quantum public keys and backward compatibility with existing wallets.',
      type: 'BIP',
      date: new Date('2025-09-10'),
      external_link: 'https://github.com/bitcoin/bips/blob/master/bip-0420.mediawiki',
      technical_level: 'Advanced',
      authors: ['Quantum Safe Working Group'],
      tags: ['BIP', 'Post-Quantum', 'Signature Schemes'],
      extras: {
        bip_number: '420',
        status: 'Proposed',
        address_prefix: 'bc1q',
      },
    },
    {
      title: 'Hybrid Signatures: Classical + Post-Quantum',
      summary:
        'Explores hybrid signature schemes that combine ECDSA/Schnorr with post-quantum algorithms. Provides security during transition period and backward compatibility.',
      type: 'Research',
      date: new Date('2024-12-15'),
      external_link: 'https://hybrid-sig.research.com/bitcoin',
      technical_level: 'Advanced',
      authors: ['Dr. Hybrid Research'],
      tags: ['Signature Schemes', 'ECDSA', 'Schnorr', 'Post-Quantum'],
      extras: {
        schemes_compared: ['ECDSA+Dilithium', 'Schnorr+FALCON'],
      },
    },
    {
      title: 'Quantum Computing Progress: 2024 Update',
      summary:
        "Annual review of quantum computing hardware progress. Covers IBM, Google, IonQ, and Rigetti developments. Assesses current qubit counts and error rates relative to Shor's algorithm requirements.",
      type: 'Article',
      date: new Date('2024-01-10'),
      external_link: 'https://quantum-review.com/2024-annual',
      technical_level: 'Beginner',
      authors: ['Quantum Review Team'],
      tags: ['Quantum Supremacy', "Shor's Algorithm"],
      extras: {
        qubit_count_2024: 1121,
        error_rate_progress: '0.1%',
      },
    },
    {
      title: 'Mining Pool Perspectives on Quantum Threats',
      summary:
        'Interviews with major Bitcoin mining pool operators on quantum threat preparedness. Discusses hardware upgrade timelines and economic incentives for post-quantum transition.',
      type: 'Article',
      date: new Date('2025-06-22'),
      external_link: 'https://mining-insights.com/quantum-perspectives',
      technical_level: 'Beginner',
      authors: ['Mining Insights Staff'],
      tags: ['Mining Security', 'Post-Quantum'],
      extras: {
        pools_interviewed: ['Foundry', 'AntPool', 'F2Pool'],
      },
    },
    {
      title: 'Lattice-Based Cryptography Primer for Bitcoin Developers',
      summary:
        "Introduction to lattice-based cryptography (foundation of Dilithium, Kyber, FALCON). Explains Learning With Errors (LWE) problem and why it's believed quantum-resistant.",
      type: 'Article',
      date: new Date('2024-07-30'),
      external_link: 'https://dev.bitcoin.org/quantum/lattice-primer',
      technical_level: 'Intermediate',
      authors: ['Bitcoin Dev Education'],
      tags: ['CRYSTALS-Dilithium', 'CRYSTALS-Kyber', 'FALCON', 'Post-Quantum'],
      extras: {
        difficulty_assumption: 'LWE',
        target_audience: 'developers',
      },
    },
    {
      title: 'Economic Analysis: Cost of NOT Upgrading to Post-Quantum',
      summary:
        'Models economic impact of delayed post-quantum migration. Estimates potential value at risk if Bitcoin addresses remain ECDSA-only until quantum computers are viable.',
      type: 'Research',
      date: new Date('2025-02-28'),
      external_link: 'https://economics.bitcoin-research.org/pqc-cost',
      technical_level: 'Intermediate',
      authors: ['Dr. Economics Researcher'],
      tags: ['Post-Quantum', 'ECDSA', 'Quantum Supremacy'],
      extras: {
        risk_estimate_usd: '100B-500B',
        methodology: 'monte_carlo',
      },
    },
    {
      title: 'Post-Quantum Bitcoin: A Roadmap',
      summary:
        'Community-driven roadmap for transitioning Bitcoin to post-quantum security. Outlines 4 phases: research (2024-2025), testnet (2026), opt-in mainnet (2027-2028), full deployment (2029+).',
      type: 'Article',
      date: new Date('2025-12-01'),
      external_link: 'https://pqbitcoin.org/roadmap',
      technical_level: 'Beginner',
      authors: ['PQ Bitcoin Community'],
      tags: ['Post-Quantum', 'BIP'],
      extras: {
        roadmap_phases: 4,
        estimated_completion: 2029,
      },
    },
  ];

  const insertedResources = await db.insert(resources).values(resourceData).returning();
  console.log(`Seeded ${insertedResources.length} resources`);

  const taskUids: number[] = [];
  for (const resource of insertedResources) {
    const task = await syncResourceToMeilisearch(resource);
    taskUids.push(task.taskUid);
  }

  console.log(`Waiting for ${taskUids.length} Meilisearch indexing tasks...`);
  await meilisearchClient.waitForTasks(taskUids);
  console.log('Synced resources to Meilisearch');

  console.log('Seed complete');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => process.exit(0));

import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Privacy Policy | Ziro Market",
  description: "Privacy Policy for Ziro Market - Learn how we protect your data",
};

export default function PrivacyPolicy() {
  const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
  const h2Style: React.CSSProperties = { fontSize: '1.3rem', letterSpacing: '-0.01em', fontWeight: 700, color: 'var(--text-1)' };
  const pStyle: React.CSSProperties = { color: 'var(--text-2)', lineHeight: 1.65 };
  const pSmallStyle: React.CSSProperties = { color: 'var(--text-3)', lineHeight: 1.65, fontSize: '0.85rem' };
  const pAccentStyle: React.CSSProperties = { ...pStyle, fontWeight: 600, color: 'var(--green)' };
  const ulStyle: React.CSSProperties = { listStyle: 'disc', marginLeft: 18, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 };
  const liStyle: React.CSSProperties = { color: 'var(--text-2)', lineHeight: 1.65 };
  const boxStyle: React.CSSProperties = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' };
  const subH3Style: React.CSSProperties = { fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-1)', marginTop: 20 };

  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <span className="section-num">№ 01 / PRIVACY</span>
        <h1 className="display" style={{ marginTop: 18, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>
          Privacy <span className="amber">Policy</span>.
        </h1>
        <p className="caption" style={{ marginTop: 12 }}>Last updated: May 2026</p>

        <article style={{ marginTop: 56, maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 28 }}>

          <section style={sectionStyle}>
            <h2 style={h2Style}>1. Introduction</h2>
            <p style={pStyle}>
              Ziro Market ("we", "our", "us", or "Company") operates the Ziro Market website and mobile application (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p style={pStyle}>
              We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This policy describes our privacy practices in clear, non-technical language.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>2. Information We DO NOT Collect</h2>
            <p style={pAccentStyle}>
              Ziro Market does NOT collect the following personal information:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Personal names or email addresses (unless voluntarily provided through contact forms)</li>
              <li style={liStyle}>Phone numbers or contact information for tracking purposes</li>
              <li style={liStyle}>Financial account information or banking details</li>
              <li style={liStyle}>User passwords or authentication credentials</li>
              <li style={liStyle}>Location data or GPS coordinates</li>
              <li style={liStyle}>Browsing history or detailed user behavior tracking</li>
              <li style={liStyle}>Information about your holdings, portfolio, or investment amounts</li>
              <li style={liStyle}>Social media profiles or personal social data</li>
              <li style={liStyle}>Biometric information</li>
              <li style={liStyle}>Payment card information (we do not process payments)</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>3. Information We Collect and Why</h2>

            <h3 style={subH3Style}>3.1 Usage Analytics (Non-Identifying)</h3>
            <p style={pStyle}>
              We use analytics services to understand how users interact with our Service. This helps us improve functionality and user experience. Information collected includes:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Page views and features accessed</li>
              <li style={liStyle}>Approximate location (country/region level only, not precise location)</li>
              <li style={liStyle}>Device type and browser information</li>
              <li style={liStyle}>Time spent on pages</li>
              <li style={liStyle}>Referral sources</li>
              <li style={liStyle}>Interaction patterns with UI elements</li>
            </ul>
            <p style={pSmallStyle}>
              This data is anonymous and aggregated. We cannot identify individual users from this data.
            </p>

            <h3 style={subH3Style}>3.2 Voluntary Information</h3>
            <p style={pStyle}>
              If you contact us through our contact form, you may provide:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Email address (for response purposes only)</li>
              <li style={liStyle}>Message content or feedback</li>
              <li style={liStyle}>Any other information you choose to share</li>
            </ul>
            <p style={pSmallStyle}>
              This information is used solely to respond to your inquiry and is not shared with third parties unless required by law.
            </p>

            <h3 style={subH3Style}>3.3 Cookies and Similar Technologies</h3>
            <p style={pStyle}>
              We use cookies and similar technologies for:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Session management (website functionality)</li>
              <li style={liStyle}>Analytics and performance monitoring</li>
              <li style={liStyle}>User preference storage (theme, language)</li>
            </ul>
            <p style={pSmallStyle}>
              You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>4. How We Use Information</h2>
            <p style={pStyle}>We use collected information only for:</p>
            <ul style={ulStyle}>
              <li style={liStyle}>Improving and optimizing the Service</li>
              <li style={liStyle}>Analyzing usage patterns to enhance user experience</li>
              <li style={liStyle}>Responding to your inquiries and support requests</li>
              <li style={liStyle}>Complying with legal obligations</li>
              <li style={liStyle}>Preventing fraudulent activity or abuse</li>
              <li style={liStyle}>Sending educational content or service updates (if you opt-in)</li>
            </ul>
            <p style={pStyle}>
              We will never use your information for marketing purposes without your explicit consent, and you can unsubscribe from any communications at any time.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>5. Data Sharing and Disclosure</h2>
            <p style={pStyle}>
              We do not sell, trade, or rent your personal information to third parties. We may disclose information only in the following circumstances:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Service Providers:</strong> We may share non-identifying analytics data with third-party service providers (e.g., Vercel Analytics) who help us understand how the Service is used</li>
              <li style={liStyle}><strong>Legal Compliance:</strong> We may disclose information if required by law, court order, or government request</li>
              <li style={liStyle}><strong>Security:</strong> We may disclose information to protect against fraud, security threats, or legal liability</li>
              <li style={liStyle}><strong>Business Transfer:</strong> In the event of a merger, acquisition, or business closure, information may be transferred as part of that transaction</li>
            </ul>
            <p style={pSmallStyle}>
              Our service providers are contractually obligated to maintain the confidentiality and security of the information we share with them.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>6. Data Security</h2>
            <p style={pStyle}>
              We implement comprehensive security measures to protect your information from unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>HTTPS encryption for all data transmitted to and from our servers</li>
              <li style={liStyle}>Regular security audits and vulnerability assessments</li>
              <li style={liStyle}>Industry-standard security protocols and firewalls</li>
              <li style={liStyle}>Limited access to personal information on a need-to-know basis</li>
              <li style={liStyle}>Regular staff training on data protection practices</li>
            </ul>
            <p style={pSmallStyle}>
              While we implement robust security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we are committed to protecting your information to the fullest extent possible.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>7. Data Retention</h2>
            <p style={pStyle}>
              We retain personal information only as long as necessary to fulfill the purposes for which it was collected:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Contact form submissions: 90 days (then securely deleted)</li>
              <li style={liStyle}>Analytics data: 13 months (then automatically purged)</li>
              <li style={liStyle}>Cookie data: As specified in cookie settings (typically session-based)</li>
              <li style={liStyle}>Log data: 30 days (for security and troubleshooting purposes)</li>
            </ul>
            <p style={pStyle}>
              If you request deletion of your information, we will comply within 30 days, except where retention is required by law.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>8. Your Rights and Choices</h2>
            <p style={pStyle}>
              You have the following rights regarding your information:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li style={liStyle}><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li style={liStyle}><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li style={liStyle}><strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
              <li style={liStyle}><strong>Cookie Control:</strong> Manage cookie preferences through your browser</li>
              <li style={liStyle}><strong>Withdraw Consent:</strong> Withdraw consent for specific data uses</li>
            </ul>
            <p style={pStyle}>
              To exercise any of these rights, please contact us at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>. We will respond to your request within 30 days.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>9. International Data Transfers</h2>
            <p style={pStyle}>
              Ziro Market operates primarily in India. However, our service providers (including analytics platforms) may be located in different countries. By using the Service, you consent to the transfer of your information to countries outside your country of residence, which may have data protection laws different from your home country.
            </p>
            <p style={pStyle}>
              We ensure appropriate safeguards are in place for any international transfers, including standard contractual clauses with our service providers.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>10. Third-Party Links and Services</h2>
            <p style={pStyle}>
              Our Service may contain links to third-party websites and services that are not operated by Ziro Market. This Privacy Policy applies only to information collected through our Service. We are not responsible for the privacy practices of third-party websites or services.
            </p>
            <p style={pStyle}>
              We recommend reviewing the privacy policies of any third-party sites you visit before providing personal information.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>11. Children's Privacy</h2>
            <p style={pStyle}>
              Our Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information and terminate the child's account.
            </p>
            <p style={pStyle}>
              Parents or guardians who believe their child has provided information to our Service should contact us immediately at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>12. Changes to Privacy Policy</h2>
            <p style={pStyle}>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated Privacy Policy on this page and update the "Last updated" date at the top.
            </p>
            <p style={pStyle}>
              Your continued use of the Service after any changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>13. GDPR Compliance (EU Users)</h2>
            <p style={pStyle}>
              If you are located in the European Union, you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Right to access, correct, and delete your data</li>
              <li style={liStyle}>Right to restrict processing and object to processing</li>
              <li style={liStyle}>Right to data portability</li>
              <li style={liStyle}>Right to lodge a complaint with your local data protection authority</li>
            </ul>
            <p style={pStyle}>
              We process personal information based on legitimate interests (improving the Service) and explicit consent for marketing communications. For any GDPR-related inquiries, contact us at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>14. California Privacy Rights (CCPA)</h2>
            <p style={pStyle}>
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Right to know what personal information is collected</li>
              <li style={liStyle}>Right to know whether personal information is sold or disclosed</li>
              <li style={liStyle}>Right to opt-out of the sale or sharing of personal information</li>
              <li style={liStyle}>Right to delete personal information collected from you</li>
              <li style={liStyle}>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p style={pStyle}>
              We do not sell or share your personal information for cross-context behavioral advertising. For CCPA requests, contact us at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>15. Contact Us</h2>
            <p style={pStyle}>
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div style={boxStyle}>
              <p style={{ ...pStyle, marginBottom: 12 }}><strong>Email:</strong> <span style={{ color: 'var(--accent)' }}>hello@ziromarket.com</span></p>
              <p style={{ ...pStyle, marginBottom: 12 }}><strong>Company:</strong> Ziro Market</p>
              <p style={pStyle}><strong>Country:</strong> India</p>
            </div>
            <p style={pSmallStyle}>
              We will acknowledge receipt of your inquiry within 5 business days and respond comprehensively within 30 days.
            </p>
          </section>

          <section style={{ background: 'rgba(45, 155, 240, 0.08)', border: '1px solid rgba(45, 155, 240, 0.2)', borderRadius: 'var(--r-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-2)' }}>Privacy Commitment</h3>
            <p style={pStyle}>
              Ziro Market is committed to protecting your privacy and being transparent about our data practices. We believe that privacy is a fundamental right, and we've designed our Service with privacy-first principles. Your trust is important to us, and we take our responsibility to protect your information seriously.
            </p>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Privacy Policy | Ziro Market",
  description: "Privacy Policy for Ziro Market - Learn how we protect your data",
};

export default function PrivacyPolicy() {
  const sectionStyle = { marginBottom: '48px' };
  const headingStyle = { fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-1)' };
  const subHeadingStyle = { fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-1)' };
  const paragraphStyle = { lineHeight: 1.7, marginBottom: '16px', color: 'var(--text-2)', fontSize: '0.95rem' };
  const listStyle = { marginLeft: '24px', marginBottom: '16px' };
  const listItemStyle = { lineHeight: 1.7, marginBottom: '8px', color: 'var(--text-2)', fontSize: '0.95rem' };
  const boxStyle = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px', marginBottom: '16px' };
  const accentBoxStyle = { ...boxStyle, background: 'rgba(45, 155, 240, 0.08)', borderColor: 'rgba(45, 155, 240, 0.2)' };
  const greenBoxStyle = { ...boxStyle, background: 'rgba(46, 204, 113, 0.08)', borderColor: 'rgba(46, 204, 113, 0.2)' };

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text-1)' }}>
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-3)', marginBottom: '64px', fontSize: '0.9rem' }}>Last updated: May 2026</p>

        <div style={{ maxWidth: '900px' }}>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>1. Introduction</h2>
            <p style={paragraphStyle}>
              Ziro Market ("we", "our", "us", or "Company") operates the Ziro Market website and mobile application (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p style={paragraphStyle}>
              We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This policy describes our privacy practices in clear, non-technical language.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>2. Information We DO NOT Collect</h2>
            <p style={{ ...paragraphStyle, fontWeight: 600, color: 'var(--green)' }}>
              Ziro Market does NOT collect the following personal information:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Personal names or email addresses (unless voluntarily provided through contact forms)</li>
              <li style={listItemStyle}>• Phone numbers or contact information for tracking purposes</li>
              <li style={listItemStyle}>• Financial account information or banking details</li>
              <li style={listItemStyle}>• User passwords or authentication credentials</li>
              <li style={listItemStyle}>• Location data or GPS coordinates</li>
              <li style={listItemStyle}>• Browsing history or detailed user behavior tracking</li>
              <li style={listItemStyle}>• Information about your holdings, portfolio, or investment amounts</li>
              <li style={listItemStyle}>• Social media profiles or personal social data</li>
              <li style={listItemStyle}>• Biometric information</li>
              <li style={listItemStyle}>• Payment card information (we do not process payments)</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>3. Information We Collect and Why</h2>

            <h3 style={subHeadingStyle}>3.1 Usage Analytics (Non-Identifying)</h3>
            <p style={paragraphStyle}>
              We use analytics services to understand how users interact with our Service. This helps us improve functionality and user experience. Information collected includes:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Page views and features accessed</li>
              <li style={listItemStyle}>• Approximate location (country/region level only, not precise location)</li>
              <li style={listItemStyle}>• Device type and browser information</li>
              <li style={listItemStyle}>• Time spent on pages</li>
              <li style={listItemStyle}>• Referral sources</li>
              <li style={listItemStyle}>• Interaction patterns with UI elements</li>
            </ul>
            <p style={{ ...paragraphStyle, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              This data is anonymous and aggregated. We cannot identify individual users from this data.
            </p>

            <h3 style={{ ...subHeadingStyle, marginTop: '32px' }}>3.2 Voluntary Information</h3>
            <p style={paragraphStyle}>
              If you contact us through our contact form, you may provide:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Email address (for response purposes only)</li>
              <li style={listItemStyle}>• Message content or feedback</li>
              <li style={listItemStyle}>• Any other information you choose to share</li>
            </ul>
            <p style={{ ...paragraphStyle, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              This information is used solely to respond to your inquiry and is not shared with third parties unless required by law.
            </p>

            <h3 style={{ ...subHeadingStyle, marginTop: '32px' }}>3.3 Cookies and Similar Technologies</h3>
            <p style={paragraphStyle}>
              We use cookies and similar technologies for:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Session management (website functionality)</li>
              <li style={listItemStyle}>• Analytics and performance monitoring</li>
              <li style={listItemStyle}>• User preference storage (theme, language)</li>
            </ul>
            <p style={{ ...paragraphStyle, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>4. How We Use Information</h2>
            <p style={paragraphStyle}>We use collected information only for:</p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Improving and optimizing the Service</li>
              <li style={listItemStyle}>• Analyzing usage patterns to enhance user experience</li>
              <li style={listItemStyle}>• Responding to your inquiries and support requests</li>
              <li style={listItemStyle}>• Complying with legal obligations</li>
              <li style={listItemStyle}>• Preventing fraudulent activity or abuse</li>
              <li style={listItemStyle}>• Sending educational content or service updates (if you opt-in)</li>
            </ul>
            <p style={paragraphStyle}>
              We will never use your information for marketing purposes without your explicit consent, and you can unsubscribe from any communications at any time.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>5. Data Sharing and Disclosure</h2>
            <p style={paragraphStyle}>
              We do not sell, trade, or rent your personal information to third parties. We may disclose information only in the following circumstances:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• <strong>Service Providers:</strong> We may share non-identifying analytics data with third-party service providers (e.g., Vercel Analytics) who help us understand how the Service is used</li>
              <li style={listItemStyle}>• <strong>Legal Compliance:</strong> We may disclose information if required by law, court order, or government request</li>
              <li style={listItemStyle}>• <strong>Security:</strong> We may disclose information to protect against fraud, security threats, or legal liability</li>
              <li style={listItemStyle}>• <strong>Business Transfer:</strong> In the event of a merger, acquisition, or business closure, information may be transferred as part of that transaction</li>
            </ul>
            <p style={{ ...paragraphStyle, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              Our service providers are contractually obligated to maintain the confidentiality and security of the information we share with them.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>6. Data Security</h2>
            <p style={paragraphStyle}>
              We implement comprehensive security measures to protect your information from unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• HTTPS encryption for all data transmitted to and from our servers</li>
              <li style={listItemStyle}>• Regular security audits and vulnerability assessments</li>
              <li style={listItemStyle}>• Industry-standard security protocols and firewalls</li>
              <li style={listItemStyle}>• Limited access to personal information on a need-to-know basis</li>
              <li style={listItemStyle}>• Regular staff training on data protection practices</li>
            </ul>
            <p style={{ ...paragraphStyle, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              While we implement robust security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we are committed to protecting your information to the fullest extent possible.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>7. Data Retention</h2>
            <p style={paragraphStyle}>
              We retain personal information only as long as necessary to fulfill the purposes for which it was collected:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Contact form submissions: 90 days (then securely deleted)</li>
              <li style={listItemStyle}>• Analytics data: 13 months (then automatically purged)</li>
              <li style={listItemStyle}>• Cookie data: As specified in cookie settings (typically session-based)</li>
              <li style={listItemStyle}>• Log data: 30 days (for security and troubleshooting purposes)</li>
            </ul>
            <p style={paragraphStyle}>
              If you request deletion of your information, we will comply within 30 days, except where retention is required by law.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>8. Your Rights and Choices</h2>
            <p style={paragraphStyle}>
              You have the following rights regarding your information:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• <strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li style={listItemStyle}>• <strong>Correction:</strong> Request correction of inaccurate information</li>
              <li style={listItemStyle}>• <strong>Deletion:</strong> Request deletion of your personal information</li>
              <li style={listItemStyle}>• <strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
              <li style={listItemStyle}>• <strong>Cookie Control:</strong> Manage cookie preferences through your browser</li>
              <li style={listItemStyle}>• <strong>Withdraw Consent:</strong> Withdraw consent for specific data uses</li>
            </ul>
            <p style={paragraphStyle}>
              To exercise any of these rights, please contact us at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>. We will respond to your request within 30 days.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>9. International Data Transfers</h2>
            <p style={paragraphStyle}>
              Ziro Market operates primarily in India. However, our service providers (including analytics platforms) may be located in different countries. By using the Service, you consent to the transfer of your information to countries outside your country of residence, which may have data protection laws different from your home country.
            </p>
            <p style={paragraphStyle}>
              We ensure appropriate safeguards are in place for any international transfers, including standard contractual clauses with our service providers.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>10. Third-Party Links and Services</h2>
            <p style={paragraphStyle}>
              Our Service may contain links to third-party websites and services that are not operated by Ziro Market. This Privacy Policy applies only to information collected through our Service. We are not responsible for the privacy practices of third-party websites or services.
            </p>
            <p style={paragraphStyle}>
              We recommend reviewing the privacy policies of any third-party sites you visit before providing personal information.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>11. Children's Privacy</h2>
            <p style={paragraphStyle}>
              Our Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information and terminate the child's account.
            </p>
            <p style={paragraphStyle}>
              Parents or guardians who believe their child has provided information to our Service should contact us immediately at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>12. Changes to Privacy Policy</h2>
            <p style={paragraphStyle}>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated Privacy Policy on this page and update the "Last updated" date at the top.
            </p>
            <p style={paragraphStyle}>
              Your continued use of the Service after any changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>13. GDPR Compliance (EU Users)</h2>
            <p style={paragraphStyle}>
              If you are located in the European Union, you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Right to access, correct, and delete your data</li>
              <li style={listItemStyle}>• Right to restrict processing and object to processing</li>
              <li style={listItemStyle}>• Right to data portability</li>
              <li style={listItemStyle}>• Right to lodge a complaint with your local data protection authority</li>
            </ul>
            <p style={paragraphStyle}>
              We process personal information based on legitimate interests (improving the Service) and explicit consent for marketing communications. For any GDPR-related inquiries, contact us at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>14. California Privacy Rights (CCPA)</h2>
            <p style={paragraphStyle}>
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>• Right to know what personal information is collected</li>
              <li style={listItemStyle}>• Right to know whether personal information is sold or disclosed</li>
              <li style={listItemStyle}>• Right to opt-out of the sale or sharing of personal information</li>
              <li style={listItemStyle}>• Right to delete personal information collected from you</li>
              <li style={listItemStyle}>• Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p style={paragraphStyle}>
              We do not sell or share your personal information for cross-context behavioral advertising. For CCPA requests, contact us at <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>15. Contact Us</h2>
            <p style={paragraphStyle}>
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div style={boxStyle}>
              <p style={{ ...paragraphStyle, marginBottom: '12px' }}><strong>Email:</strong> <span style={{ color: 'var(--accent)' }}>hello@ziromarket.com</span></p>
              <p style={{ ...paragraphStyle, marginBottom: '12px' }}><strong>Company:</strong> Ziro Market</p>
              <p style={paragraphStyle}><strong>Country:</strong> India</p>
            </div>
            <p style={{ ...paragraphStyle, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              We will acknowledge receipt of your inquiry within 5 business days and respond comprehensively within 30 days.
            </p>
          </section>

          <section style={{ ...accentBoxStyle, marginTop: '64px' }}>
            <h3 style={{ ...subHeadingStyle, color: 'var(--accent-2)', marginBottom: '12px' }}>Privacy Commitment</h3>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              Ziro Market is committed to protecting your privacy and being transparent about our data practices. We believe that privacy is a fundamental right, and we've designed our Service with privacy-first principles. Your trust is important to us, and we take our responsibility to protect your information seriously.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}

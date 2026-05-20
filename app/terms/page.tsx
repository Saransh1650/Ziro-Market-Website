import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: "Terms of Use | Ziro Market",
  description: "Terms of Use for Ziro Market - Our service agreement",
};

export default function TermsOfUse() {
  const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
  const h2Style: React.CSSProperties = { fontSize: '1.3rem', letterSpacing: '-0.01em', fontWeight: 700, color: 'var(--text-1)' };
  const pStyle: React.CSSProperties = { color: 'var(--text-2)', lineHeight: 1.65 };
  const pSmallStyle: React.CSSProperties = { color: 'var(--text-3)', lineHeight: 1.65, fontSize: '0.85rem' };
  const ulStyle: React.CSSProperties = { listStyle: 'disc', marginLeft: 18, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 };
  const liStyle: React.CSSProperties = { color: 'var(--text-2)', lineHeight: 1.65 };
  const boxStyle: React.CSSProperties = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' };
  const warningBoxStyle: React.CSSProperties = { background: 'rgba(255, 77, 79, 0.08)', border: '1px solid rgba(255, 77, 79, 0.2)', borderRadius: 'var(--r-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 8 };

  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <span className="section-num">№ 02 / TERMS</span>
        <h1 className="display" style={{ marginTop: 18, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>
          Terms of <span className="amber">Service</span>.
        </h1>
        <p className="caption" style={{ marginTop: 12 }}>Last updated: May 2026</p>

        <article style={{ marginTop: 56, maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 28 }}>

          <section style={sectionStyle}>
            <h2 style={h2Style}>1. Acceptance of Terms</h2>
            <p style={pStyle}>
              By accessing and using Ziro Market (the "Service"), you agree to be bound by these Terms of Use. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p style={pStyle}>
              Ziro Market reserves the right to update and change these Terms of Use from time to time without notice. Your continued use of the Service after any such changes shall constitute your acceptance of the new Terms of Use.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>2. Service Description</h2>
            <p style={pStyle}>
              Ziro Market provides a web and mobile platform for viewing and analyzing publicly available market data, including:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Real-time and historical stock price data</li>
              <li style={liStyle}>Market indices (NIFTY 50, SENSEX, Bank Nifty, etc.)</li>
              <li style={liStyle}>Sector heatmaps and performance analytics</li>
              <li style={liStyle}>Volume and technical indicators</li>
              <li style={liStyle}>News aggregation related to Indian markets</li>
              <li style={liStyle}>Watchlist and portfolio tracking tools</li>
            </ul>
            <p style={pStyle}>
              The Service is designed for educational and informational purposes to help users understand market trends and make informed decisions about their investments.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>3. Not Investment Advice</h2>
            <div style={warningBoxStyle}>
              <p style={{ ...pStyle, fontWeight: 600, color: 'var(--red)' }}>IMPORTANT DISCLAIMER:</p>
              <p style={pStyle}>
                All information provided on Ziro Market is for informational and educational purposes only. <strong>Nothing on this platform constitutes professional investment advice, financial advice, or a recommendation to buy or sell any security.</strong>
              </p>
            </div>
            <p style={pStyle}>
              Market data, analysis, signals, and commentary provided through the Service are not investment recommendations and should not be relied upon as such. Investing in securities carries significant risk, including potential loss of principal.
            </p>
            <p style={pStyle}>
              Before making any investment decision, you should conduct your own research and consult with a qualified financial advisor or investment professional who understands your personal financial situation, investment objectives, and risk tolerance.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>4. No Liability for Market Losses</h2>
            <p style={pStyle}>
              Ziro Market and its creators, operators, and service providers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Investment decisions made based on information from the Service</li>
              <li style={liStyle}>Trading losses or poor investment performance</li>
              <li style={liStyle}>Inaccuracies in market data or analysis</li>
              <li style={liStyle}>Delays in data updates or service interruptions</li>
              <li style={liStyle}>Use or reliance on the Service in any manner</li>
            </ul>
            <p style={pStyle}>
              By using Ziro Market, you acknowledge and accept full responsibility for all investment decisions and their financial consequences.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>5. Accuracy of Information</h2>
            <p style={pStyle}>
              While we strive to provide accurate and timely information, Ziro Market does not guarantee the accuracy, completeness, or timeliness of any information displayed on the Service.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Market data is sourced from third-party providers and may have delays</li>
              <li style={liStyle}>Historical data is provided for reference and may contain minor discrepancies</li>
              <li style={liStyle}>Technical indicators and analysis are calculated automatically and may contain errors</li>
              <li style={liStyle}>News and articles are aggregated from multiple sources and may not be verified</li>
            </ul>
            <p style={pStyle}>
              We are not responsible for errors or omissions in the information provided. Users should verify critical information through official sources (NSE, BSE, etc.) before making investment decisions.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>6. User Responsibilities and Conduct</h2>
            <p style={pStyle}>
              When using Ziro Market, you agree to:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Use the Service only for lawful purposes</li>
              <li style={liStyle}>Not engage in any activity that disrupts or interferes with the Service</li>
              <li style={liStyle}>Not attempt to gain unauthorized access to the Service or its systems</li>
              <li style={liStyle}>Not reverse-engineer, decompile, or attempt to discover the source code</li>
              <li style={liStyle}>Not use the Service for any commercial purpose without written permission</li>
              <li style={liStyle}>Not scrape, crawl, or automatically collect data from the Service</li>
              <li style={liStyle}>Not use the Service to conduct illegal activities or violate securities laws</li>
              <li style={liStyle}>Not impersonate any person or entity</li>
              <li style={liStyle}>Not harass, threaten, or abuse other users</li>
              <li style={liStyle}>Not post spam, malware, or offensive content</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>7. Intellectual Property Rights</h2>
            <p style={pStyle}>
              All content on Ziro Market, including text, graphics, logos, images, and software, is the property of Ziro Market or its content suppliers and is protected by international copyright laws.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>You may view and print material for personal, non-commercial use only</li>
              <li style={liStyle}>You may not reproduce, distribute, or transmit any content without permission</li>
              <li style={liStyle}>You may not modify or create derivative works based on our content</li>
              <li style={liStyle}>You may not remove any proprietary notices or labels from our content</li>
            </ul>
            <p style={pStyle}>
              Limited license to use the Service is granted for non-commercial purposes. This license is revocable at any time.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>8. User-Generated Content</h2>
            <p style={pStyle}>
              If the Service allows you to submit content (such as comments, feedback, or watchlists), you grant Ziro Market a non-exclusive, royalty-free license to use such content.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>You retain ownership of your user-generated content</li>
              <li style={liStyle}>You warrant that you own or have rights to the content you submit</li>
              <li style={liStyle}>You agree not to submit content that is illegal, defamatory, or violates others' rights</li>
              <li style={liStyle}>We may remove content that violates these terms</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>9. Data Accuracy and Market Data Disclaimer</h2>
            <p style={pStyle}>
              The market data and information provided through Ziro Market is sourced from third-party data providers including:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>National Stock Exchange (NSE)</li>
              <li style={liStyle}>Bombay Stock Exchange (BSE)</li>
              <li style={liStyle}>Multi Commodity Exchange (MCX)</li>
              <li style={liStyle}>Third-party data aggregators and APIs</li>
            </ul>
            <p style={pStyle}>
              <strong>DISCLAIMER:</strong> We do not guarantee that data is perfectly accurate, complete, or free from errors. Market data may be delayed. Users must verify critical data through official exchange sources before trading or making investment decisions.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>10. Third-Party Links and Content</h2>
            <p style={pStyle}>
              Ziro Market may contain links to third-party websites, resources, and content. We do not endorse, control, or assume responsibility for the content of third-party websites.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>We are not responsible for the availability or accuracy of external content</li>
              <li style={liStyle}>Use of third-party websites is at your own risk</li>
              <li style={liStyle}>Read the terms and privacy policies of third-party sites before using them</li>
              <li style={liStyle}>Links do not imply endorsement or affiliation</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>11. Service Availability and Interruptions</h2>
            <p style={pStyle}>
              While we strive to maintain high availability, Ziro Market is provided on an "as-is" basis without guarantees of continuous, uninterrupted service.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Service may be interrupted for maintenance, updates, or technical issues</li>
              <li style={liStyle}>We are not liable for any losses resulting from service outages</li>
              <li style={liStyle}>Market hours may result in delays or limitations on data updates</li>
              <li style={liStyle}>We do not guarantee real-time data delivery during peak market hours</li>
            </ul>
            <p style={pStyle}>
              We will make reasonable efforts to notify users of scheduled maintenance in advance.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>12. Account Security</h2>
            <p style={pStyle}>
              If you create an account on Ziro Market, you are responsible for:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Maintaining the confidentiality of your login credentials</li>
              <li style={liStyle}>All activity that occurs under your account</li>
              <li style={liStyle}>Notifying us immediately of unauthorized access or use</li>
              <li style={liStyle}>Choosing a strong password and keeping it secure</li>
            </ul>
            <p style={pStyle}>
              Ziro Market is not responsible for unauthorized access resulting from your negligence or failure to protect your credentials.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>13. Limitation of Liability</h2>
            <div style={{ ...boxStyle, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ ...pStyle, fontWeight: 600 }}>TO THE FULLEST EXTENT PERMITTED BY LAW:</p>
              <ul style={ulStyle}>
                <li style={liStyle}>Ziro Market's total liability shall not exceed the amount you paid (if any) in the past 12 months</li>
                <li style={liStyle}>We shall not be liable for any indirect, incidental, special, or consequential damages</li>
                <li style={liStyle}>This includes lost profits, loss of data, business interruption, or emotional distress</li>
                <li style={liStyle}>These limitations apply even if we've been advised of the possibility of such damages</li>
              </ul>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>14. Indemnification</h2>
            <p style={pStyle}>
              You agree to indemnify, defend, and hold harmless Ziro Market, its founders, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Your use of the Service or violation of these terms</li>
              <li style={liStyle}>Your investment decisions or trading activity</li>
              <li style={liStyle}>Intellectual property infringement by your content</li>
              <li style={liStyle}>Violation of applicable laws or regulations</li>
              <li style={liStyle}>Your interactions with other users or third parties</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>15. Regulatory Compliance</h2>
            <p style={pStyle}>
              Ziro Market is not a registered financial advisor, broker, or investment company. Users are responsible for:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Understanding and complying with applicable securities laws</li>
              <li style={liStyle}>Reporting gains/losses for tax purposes as required by law</li>
              <li style={liStyle}>Verifying that their use complies with local regulations</li>
              <li style={liStyle}>Seeking professional tax and legal advice when needed</li>
            </ul>
            <p style={pStyle}>
              The Service is provided for educational purposes and is not intended to be used for illegal activities or to circumvent financial regulations.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>16. Prohibited Jurisdictions</h2>
            <p style={pStyle}>
              The Service is not available to residents of certain jurisdictions where it may violate local laws. If your jurisdiction prohibits use of this Service, you may not use it.
            </p>
            <p style={pStyle}>
              Users must verify that using Ziro Market complies with their local securities and financial regulations before accessing the Service.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>17. Suspension and Termination</h2>
            <p style={pStyle}>
              Ziro Market reserves the right to suspend or terminate your access to the Service if you:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Violate these Terms of Use</li>
              <li style={liStyle}>Engage in illegal or fraudulent activity</li>
              <li style={liStyle}>Disrupt the Service or other users</li>
              <li style={liStyle}>Violate applicable laws or regulations</li>
              <li style={liStyle}>Use the Service in a manner we deem harmful</li>
            </ul>
            <p style={pStyle}>
              Termination may be immediate and without notice. You remain liable for all obligations incurred before termination.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>18. Dispute Resolution</h2>
            <p style={pStyle}>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflicts of law provisions.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Any disputes shall be subject to the exclusive jurisdiction of courts in India</li>
              <li style={liStyle}>You waive any objection to venue or forum</li>
              <li style={liStyle}>We encourage users to first contact us to resolve disputes informally</li>
              <li style={liStyle}>If disputes cannot be resolved, arbitration or court proceedings may be necessary</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>19. Disclaimers</h2>
            <div style={{ ...boxStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ ...pStyle, fontWeight: 600 }}>AS-IS BASIS:</p>
                <p style={pStyle}>
                  The Service is provided on an "as-is" and "as-available" basis. We make no warranties, express or implied, regarding the Service, including warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ ...pStyle, fontWeight: 600 }}>NO GUARANTEE OF ACCURACY:</p>
                <p style={pStyle}>
                  We do not warrant that information is accurate, complete, timely, or reliable. Use of the Service is at your sole risk.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ ...pStyle, fontWeight: 600 }}>NO INVESTMENT GUARANTEE:</p>
                <p style={pStyle}>
                  Past performance does not guarantee future results. Market conditions can change rapidly. All investments carry risk.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ ...pStyle, fontWeight: 600 }}>NOT FOR TRADING DECISIONS:</p>
                <p style={pStyle}>
                  Ziro Market should not be used as the sole basis for trading or investment decisions. Always conduct independent research.
                </p>
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>20. Severability</h2>
            <p style={pStyle}>
              If any provision of these Terms is found to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary, or if not possible, shall be severed. The remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>21. Entire Agreement</h2>
            <p style={pStyle}>
              These Terms of Use constitute the entire agreement between you and Ziro Market regarding the Service, superseding all prior agreements and understandings.
            </p>
            <p style={pStyle}>
              If there are any conflicts between these Terms and our Privacy Policy, the Privacy Policy shall govern matters related to data and privacy.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>22. Amendments and Updates</h2>
            <p style={pStyle}>
              We reserve the right to modify these Terms of Use at any time. Changes will be effective upon posting to the website. Your continued use of the Service after changes constitute acceptance of the new Terms.
            </p>
            <p style={pStyle}>
              We encourage you to review these Terms periodically to stay informed about your rights and responsibilities.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>23. Contact Information</h2>
            <p style={pStyle}>
              If you have questions or concerns regarding these Terms of Use, please contact us:
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
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--green)' }}>Fair Use Commitment</h3>
            <p style={pStyle}>
              Ziro Market is committed to providing a fair, transparent, and legal platform for market research and education. We do not facilitate illegal trading, insider trading, manipulation, or any activity that violates securities laws. All users must comply with applicable financial regulations in their jurisdiction. Our Service is designed to empower informed decision-making while maintaining the highest standards of integrity and compliance.
            </p>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}

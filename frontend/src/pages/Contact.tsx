import { useApp } from '../app';
import { Errors, FormAlert, SubmitButton, useSubmit } from '../components/forms';
import { useTitle } from '../lib';

export default function Contact() {
  useTitle('Contact & Support • HOMline DIGI seva');
  const { notify } = useApp();
  const { errors, busy, submit } = useSubmit<{ message: string }>('contact/', (d, form) => {
    form.reset();
    notify(d.message);
    window.scrollTo(0, 0);
  });
  const box = (bg: string, icon: string, dark = false) => (
    <div className={`brand-icon-box ${bg} ${dark ? 'text-dark' : 'text-white'} flex-shrink-0`} style={{ width: 48, height: 48, fontSize: '1.3rem' }}><i className={`bi ${icon}`}></i></div>
  );
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">24×7 Support Channels</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">Contact HOMline Support</h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-0">Reach out via WhatsApp, direct phone call, email, or online enquiry form. We are here to simplify your digital services.</p>
        </div>
      </section>
      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <div className="homline-card bg-white mb-4">
                <h4 className="fw-bold text-navy mb-4"><i className="bi bi-headset text-teal me-2"></i> Contact Information</h4>
                <div className="d-flex align-items-start gap-3 mb-4">
                  {box('bg-navy', 'bi-telephone-fill')}
                  <div>
                    <span className="text-muted small d-block">Phone / WhatsApp Support</span>
                    <strong className="text-navy fs-5 font-monospace">6282268453</strong>
                    <div className="mt-2 d-flex gap-2">
                      <a href="tel:6282268453" className="btn btn-navy btn-sm">Call Now</a>
                      <a href="https://wa.me/916282268453" target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">WhatsApp Chat</a>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3 mb-4">
                  {box('bg-teal', 'bi-envelope-fill')}
                  <div><span className="text-muted small d-block">Official Support Email</span><strong className="text-navy">homlinedigital@gmail.com</strong></div>
                </div>
                <div className="d-flex align-items-start gap-3 mb-4">
                  {box('bg-gold', 'bi-globe', true)}
                  <div><span className="text-muted small d-block">Official Website</span><a href="https://www.amdgmedia.co.in" target="_blank" rel="noopener noreferrer" className="text-teal fw-bold text-decoration-none">www.amdgmedia.co.in</a></div>
                </div>
                <hr className="my-4" />
                <div className="p-3 bg-soft-mist rounded-3 border">
                  <h6 className="fw-bold text-navy mb-1"><i className="bi bi-building me-1 text-teal"></i> Organisation Attribution</h6>
                  <p className="text-muted small mb-0">HOMline DIGI seva • An Initiative of <strong>AMDG Group</strong></p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="homline-card bg-white p-4 p-md-5">
                <h3 className="fw-bold text-navy mb-2">Send an Enquiry Message</h3>
                <p className="text-muted small mb-4">Fill out this quick form and our support team will respond via Call / WhatsApp.</p>
                <form onSubmit={submit}>
                  <FormAlert errors={errors} />
                  <div className="mb-3">
                    <label className="form-label fw-bold text-navy" htmlFor="cName">Your Name *</label>
                    <input id="cName" name="name" className="form-control" placeholder="Your Name" required />
                    <Errors errors={errors} name="name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-navy" htmlFor="cMobile">Mobile Number *</label>
                    <input id="cMobile" name="mobile" type="tel" className="form-control" placeholder="Mobile Number" required />
                    <Errors errors={errors} name="mobile" />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-navy" htmlFor="cMsg">How can HOMline help you today? *</label>
                    <textarea id="cMsg" name="message" className="form-control" rows={3} placeholder="How can HOMline help you today?" required />
                    <Errors errors={errors} name="message" />
                  </div>
                  <SubmitButton busy={busy} className="btn btn-navy btn-lg w-100 fw-bold">Send Message to HOMline <i className="bi bi-send-fill ms-1"></i></SubmitButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

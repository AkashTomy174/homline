import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../app';
import { FormAlert, SubmitButton, useSubmit } from '../components/forms';
import RequestFields from '../components/RequestFields';
import { useTitle } from '../lib';

export default function RequestPage() {
  useTitle('Request a Digital Service • HOMline DIGI seva');
  const [params] = useSearchParams();
  const { notify } = useApp();
  const navigate = useNavigate();
  const { errors, busy, submit } = useSubmit<{ request_id: string }>('requests/', (d) => {
    notify(`Your request has been registered! Request ID: ${d.request_id}.`);
    navigate(`/track/${d.request_id}`);
  });
  return (
    <>
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-2">
          <span className="badge bg-gold text-dark px-3 py-2 rounded-pill font-monospace fw-bold text-uppercase mb-3">Online Request Form</span>
          <h1 className="display-5 fw-extrabold text-white mb-3">Request Digital Service Assistance</h1>
          <p className="lead text-white-50 max-width-700 mx-auto mb-0">Fill out your details below. You will receive an instant Request ID to track status online or via WhatsApp.</p>
        </div>
      </section>
      <section className="py-5 bg-soft-mist">
        <div className="container">
          <div className="max-width-800 mx-auto">
            <div className="homline-card bg-white p-4 p-md-5 shadow-lg border-0">
              <form onSubmit={submit}>
                <FormAlert errors={errors} />
                <RequestFields errors={errors} idp="rp-" serviceId={params.get('service_id') ?? undefined} />
                <div className="disclaimer-box my-4">
                  <i className="bi bi-shield-lock-fill text-warning me-1"></i> HOMline handles all uploaded document files and identity details with strict privacy and confidentiality.
                </div>
                <div className="d-grid">
                  <SubmitButton busy={busy} className="btn btn-teal btn-lg fw-bold py-3">Submit Service Request &amp; Get Request ID <i className="bi bi-arrow-right ms-2"></i></SubmitButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

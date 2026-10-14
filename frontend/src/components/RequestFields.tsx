import { useApp } from '../app';
import type { FieldErrors } from '../api';
import { Errors } from './forms';

/** Service request fields shared by the modal, the /request page and any inline forms. */
export default function RequestFields({
  errors, idp, serviceId, large = true,
}: { errors: FieldErrors; idp: string; serviceId?: string; large?: boolean }) {
  const { serviceOptions, user } = useApp();
  const lg = large ? ' form-control-lg' : '';
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}name`}>Full Name <span className="text-danger" aria-hidden="true">*</span></label>
        <input id={`${idp}name`} name="full_name" className={`form-control${lg}`} placeholder="Enter your full name" defaultValue={user?.first_name ?? ''} required />
        <Errors errors={errors} name="full_name" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}mobile`}>Mobile Number <span className="text-danger" aria-hidden="true">*</span></label>
        <input id={`${idp}mobile`} name="mobile" type="tel" className={`form-control${lg}`} placeholder="Enter your mobile number" required />
        <Errors errors={errors} name="mobile" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}email`}>Email Address (Optional)</label>
        <input id={`${idp}email`} name="email" type="email" className={`form-control${lg}`} placeholder="name@example.com" defaultValue={user?.email ?? ''} />
        <Errors errors={errors} name="email" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}service`}>Preferred Service</label>
        <select id={`${idp}service`} name="service" className={`form-select${lg}`} defaultValue={serviceId ?? ''} key={`${serviceId}-${serviceOptions.length}`}>
          <option value="">Select from supported services...</option>
          {serviceOptions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <Errors errors={errors} name="service" />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}details`}>Requirement Details <span className="text-danger" aria-hidden="true">*</span></label>
        <textarea id={`${idp}details`} name="requirement_details" className="form-control" rows={3} placeholder="Describe what digital service or guidance you need (e.g. fresh PAN card, passport appointment, exam form filling, ticket booking)..." required />
        <Errors errors={errors} name="requirement_details" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}channel`}>Preferred Contact Channel</label>
        <select id={`${idp}channel`} name="contact_preference" className="form-select" defaultValue="WhatsApp">
          <option value="WhatsApp">WhatsApp Message</option>
          <option value="Call">Direct Phone Call</option>
          <option value="Email">Email Communication</option>
        </select>
        <Errors errors={errors} name="contact_preference" />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold text-navy" htmlFor={`${idp}doc`}>Upload Document (Optional)</label>
        <input id={`${idp}doc`} type="file" name="document_upload" className="form-control" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" aria-describedby={`${idp}hint`} />
        <div className="form-text" id={`${idp}hint`}>PDF, DOC, DOCX, JPG or PNG · up to 10 MB</div>
        <Errors errors={errors} name="document_upload" />
      </div>
    </div>
  );
}

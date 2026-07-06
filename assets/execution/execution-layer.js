function result(adapter, actionId, status, body, extras = {}) {
  return {
    adapter,
    actionId,
    status,
    body,
    ...extras
  };
}

function createAdapter({ key, label, provider, supports }) {
  return {
    key,
    label,
    provider,
    supports,
    validate(action = {}) {
      return result(key, action.id, 'Ready for Approval', `${label} can validate payload structure and approval metadata, but execution remains locked until a future live adapter is enabled.`, {
        checks: ['Schema valid', 'Approval-first enforcement active', 'No automatic execution enabled']
      });
    },
    preview(action = {}) {
      return result(key, action.id, 'Preview Ready', `${label} can preview ${action.actionType || 'action'} payloads for executive review without leaving EP Hub.`, {
        preview: {
          title: action.title,
          owner: action.owner,
          dueDate: action.dueDate,
          providers: action.linkedProviders || []
        }
      });
    },
    execute(action = {}) {
      return result(key, action.id, 'Approval Required', 'Approval Required', {
        blocked: true,
        reason: 'Execution adapters are scaffolded for the future, but automation is intentionally disabled in v2.0.'
      });
    }
  };
}

export function createExecutionLayer() {
  const adapters = {
    email: createAdapter({ key: 'email', label: 'EmailAdapter', provider: 'Gmail', supports: ['Reply to Email', 'Follow Up Customer'] }),
    calendar: createAdapter({ key: 'calendar', label: 'CalendarAdapter', provider: 'Google Calendar', supports: ['Book Calendar Event', 'Schedule Campaign'] }),
    social: createAdapter({ key: 'social', label: 'SocialAdapter', provider: 'Unified Social', supports: ['Publish Social Post', 'Publish LinkedIn Article', 'Approve Blog'] }),
    accounting: createAdapter({ key: 'accounting', label: 'AccountingAdapter', provider: 'Finance Provider', supports: ['Approve Invoice', 'Approve Supplier Payment', 'Review Cash Flow', 'Review Forecast'] }),
    crm: createAdapter({ key: 'crm', label: 'CRMAdapter', provider: 'CRM / Booking Intelligence', supports: ['Review Customer Complaint', 'Follow Up Customer', 'Complete Task'] })
  };

  return Object.freeze({
    getAdapters() {
      return Object.values(adapters);
    },
    getAdapter(key) {
      return adapters[key] || null;
    },
    describe() {
      return Object.values(adapters).map((adapter) => ({
        key: adapter.key,
        label: adapter.label,
        provider: adapter.provider,
        supports: adapter.supports,
        execution: 'Approval Required'
      }));
    }
  });
}

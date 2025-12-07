import { modals } from '@mantine/modals'

import { ReportUserModal } from './ReportUserModal'

export const openReportUserModal = (reportedId: number) => {
  modals.open({
    modalId: 'report-user',
    children: (
      <ReportUserModal
        opened={true}
        onClose={() => modals.close('report-user')}
        reportedId={reportedId}
      />
    ),
  })
}

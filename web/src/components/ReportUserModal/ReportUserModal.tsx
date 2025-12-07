import { useState } from 'react'

import { Modal, Select, Textarea, Button, Stack, Text } from '@mantine/core'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_REPORT = gql`
  mutation CreateReport($input: CreateReportInput!) {
    createReport(input: $input) {
      id
      status
    }
  }
`

const REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment / Bullying' },
  { value: 'hate_speech', label: 'Hate Speech' },
  { value: 'impersonation', label: 'Impersonation / Fake Account' },
  { value: 'fraud', label: 'Fraud / Scam' },
  { value: 'other', label: 'Other' },
]

export const ReportUserModal = ({ opened, onClose, reportedId }) => {
  const [reason, setReason] = useState('spam')
  const [details, setDetails] = useState('')

  const [createReport, { loading }] = useMutation(CREATE_REPORT, {
    onCompleted: () => {
      toast.success('Report submitted successfully.')
      onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = () => {
    createReport({
      variables: {
        input: {
          reportedId,
          reason,
          details: details.trim() ? details : null,
        },
      },
    })
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Report User" centered>
      <Stack>
        <Text>Select a violation category:</Text>
        <Select data={REASONS} value={reason} onChange={setReason} />

        <Textarea
          label="Additional Details (optional)"
          placeholder="Describe the violation..."
          minRows={3}
          value={details}
          onChange={(e) => setDetails(e.currentTarget.value)}
        />

        <Button fullWidth loading={loading} onClick={onSubmit}>
          Submit Report
        </Button>
      </Stack>
    </Modal>
  )
}


import { useForm } from '@mantine/form';
import { TextInput, Text, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, FormEvent } from 'react';

export default function Delete() {
  const urlValidateRegEx = /^http:\/\/localhost:8100\/[^\/\\]+$/;
  const [serverIssue, setServerIssue] = useState('');

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      shortUrl: '',
    },
    validate: {
        shortUrl: (value) => (urlValidateRegEx.test(value) ? null : 'Please check ur url' ),
    },
  });
  
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validateRes = form.validate();

    if(validateRes.hasErrors){
      return;
    }

    const shortId = form.values.shortUrl.split('/').filter(Boolean).pop()

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/${shortId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: `Short url was deleted!`,
      })
      return;
    }

    const result = await response.json();
    notifications.show({
      color: 'red',
      title: 'Error',
      message: `Something go wrong`,
    })

    setServerIssue(result.message || 'Unexpected error')
  }

  return (
    <form onSubmit={onSubmit}>
        <TextInput
            label="Short URL"
            placeholder="https://mangalib.me/ru/manga/93831--chi-chikyuu-no-undou-ni-tsuite"
            {...form.getInputProps('shortUrl')}
        />
        {!!serverIssue.length && 
          <Text size="sm" mt="xl" color='red'>
             {serverIssue}
          </Text>
        }
        <Button type="submit" mt="sm">
            Delete
        </Button>
    </form>
  );
}

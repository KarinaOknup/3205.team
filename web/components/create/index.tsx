
import { useForm } from '@mantine/form';
import { TextInput, Code, Text, Button} from '@mantine/core';
import {nanoid} from 'nanoid'
import { useEffect, useState, FormEvent } from 'react';

export default function Create() {
  const [shortId, setShortId] = useState(nanoid());
  const [shortUrl, setShortUrl] = useState('');
  const [serverIssue, setServerIssue] = useState('');

  const urlValidateRegEx = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      originalUrl: '',
      alias: '',
    },
    validate: {
      originalUrl: (value:string) => (urlValidateRegEx.test(value) ? null : 'Please check ur url' ),
      alias: (value:string) => (value.length > 20 ? 'Alias should be less than 20' : null),
    },
  });

  useEffect(() => {
    setServerIssue('');
    setShortUrl(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${form.values.alias.length > 0 ? form.values.alias.replace(/\s/g,'_') : shortId}`)
  }, [shortId, form.values.alias])


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validateRes = form.validate();

    if(validateRes.hasErrors){
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/shorten`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...form.values, shortId: shortId}),
    })

    if (response.ok) {
      navigator.clipboard.writeText(shortUrl);
      setShortId(nanoid());
      form.reset()

      return;
    }
    const result = await response.json();

    setServerIssue(result.message || 'Unexpected error')
  }

  return (
    <form onSubmit={onSubmit}>
        <TextInput
            label="URL"
            placeholder="https://mangalib.me/ru/manga/93831--chi-chikyuu-no-undou-ni-tsuite"
            {...form.getInputProps('originalUrl')}
        />
        <TextInput
            label="Alias"
            placeholder="tears"
            mt="md"
            {...form.getInputProps('alias')}
        />

        <Text size="sm" mt="xl">
            Short url (will be copied after submit):
        </Text>
        <Code block mt={5}>
            {shortUrl}
        </Code>
        {!!serverIssue.length && 
          <Text size="sm" mt="xl" color='red'>
             {serverIssue}
          </Text>
        }
        <Button type="submit" mt="sm">
            Submit
        </Button>
    </form>
  );
}


import { useForm } from '@mantine/form';
import { TextInput, Code, Text, Button} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DateInput } from '@mantine/dates';
import {nanoid} from 'nanoid'
import { useEffect, useState, FormEvent } from 'react'
import moment from 'moment'

type ObjectType = {[index: string]: string | null | ObjectType }
function removeEmpty(obj:ObjectType) {
  const newObj:ObjectType = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === Object(v)) {
      newObj[k] = removeEmpty(v as ObjectType);
    } else if (v != null) {
      newObj[k] = obj[k];
    }
  });
  return newObj;
}

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
      expiresAt: null
    },
    validate: {
      originalUrl: (value:string) => (urlValidateRegEx.test(value) ? null : 'Please check ur url' ),
      alias: (value:string) => (value.length > 20 ? 'Alias should be less than 20' : null),
    },
  });

  useEffect(() => {
    setServerIssue('');
    setShortUrl(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${form.values.alias.length > 0 ? form.values.alias.trim().replace(/\s/g,'_') : shortId}`)
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
      body: JSON.stringify(removeEmpty({...form.values, shortId: shortId})),
    })

    if (response.ok) {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: `Short url was created! Check:${shortUrl} 🌟`,
      })
      navigator.clipboard.writeText(shortUrl);
      setShortId(nanoid());
      form.reset()

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
        <DateInput
          mt="md"
          valueFormat="YYYY-MM-DD"
          minDate={moment().add(1, 'day').toDate()}
          label="Expires At"
          placeholder="1543-01-01"
          {...form.getInputProps('expiresAt')}
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

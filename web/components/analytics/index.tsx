
import { useForm } from '@mantine/form';
import { TextInput, Code, Text, Button, Checkbox, Flex } from '@mantine/core';
import { useState, FormEvent, useEffect } from 'react';

export default function Analytics() {
  const urlValidateRegEx = /^http:\/\/localhost:8100\/[^\/\\]+$/;
  const [serverIssue, setServerIssue] = useState('');
  const [info, setInfo] = useState('');

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      shortUrl: '',
      showAll: true,
    },
    validate: {
        shortUrl: (value) => (urlValidateRegEx.test(value) ? null : 'Please check ur url' ),
    },
  });

  useEffect(()=>{
    setInfo('')
  },[form.values.shortUrl])
  
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validateRes = form.validate();

    if(validateRes.hasErrors){
      return;
    }

    const shortId = form.values.shortUrl.split('/').filter(Boolean).pop();
    let infoLink = 'info';

    if (form.values.showAll) {
      infoLink = 'analytics'
    }

    const response = await fetch(`http://localhost:8100/api/v1/${infoLink}/${shortId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const info = await response.json();

      setInfo(JSON.stringify(info))
      return;
    }

    const result = await response.json();

    setServerIssue(result.message || 'Unexpected error')
  }
  return (
    <Flex direction={"column"}>
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
            <Checkbox
              mt="md"
              label="Show deleted and active, also show last 5 users"
              {...form.getInputProps('showAll', { type: 'checkbox' })}
            />
            <Button type="submit" mt="sm">
                Get info
            </Button>
        </form>
        {!!info.length && 
          <Code mt={20}>
            {info}
          </Code>
        }
    </Flex>
  );
}

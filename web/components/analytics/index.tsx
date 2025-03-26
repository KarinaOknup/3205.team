
import { useForm } from '@mantine/form';
import { TextInput, Badge, Text, Button, Flex, Box, rem } from '@mantine/core';
import { useState, FormEvent, useEffect } from 'react';
import { nanoid } from 'nanoid';

export default function Analytics() {
  const urlValidateRegEx = /^http:\/\/localhost:8100\/[^\/\\]+$/;
  const [serverIssue, setServerIssue] = useState('');
  const [info, setInfo] = useState<{count: number, userIps: string[]} | null>(null);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      shortUrl: '',
    },
    validate: {
        shortUrl: (value) => (urlValidateRegEx.test(value) ? null : 'Please check ur url' ),
    },
  });

  useEffect(()=>{
    setInfo(null)
  },[form.values.shortUrl])
  
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validateRes = form.validate();

    if(validateRes.hasErrors){
      return;
    }

    const shortId = form.values.shortUrl.split('/').filter(Boolean).pop();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/analytics/${shortId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const info = await response.json();

      setInfo(info)
      return;
    }

    const result = await response.json();

    setServerIssue(result.message || 'Unexpected error')
  }
  return (
    <Flex direction={"column"}>
        <Text c="dimmed" mb={10}>Analytics provides data for all redirects associated with this link, including expired and deleted links with the same alias.</Text>
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
                Get info
            </Button>
        </form>
        {!!info &&
          <Flex
            mt={20}
            direction={"column"}
          >
            <Badge w={"fit-content"} >{info.count} redirects</Badge>
            {
              info.userIps.length > 0 &&
              <Box 
                sx={(theme) => ({
                  backgroundColor: theme.colors.gray[0],
                  borderRadius: theme.radius.md,
                  padding: rem(20),
                  marginTop: rem(10)
                })}
              >
                <Text mb={10} fw={500}>Last users IPs: </Text>
                <Flex direction={"column"}>
                  {
                    info.userIps.map(ip => <Badge my={10} w={"fit-content"} color="indigo" key={nanoid()}>{ip}</Badge>)
                  }
                </Flex>
              </Box>
            }
          </Flex>
        }
    </Flex>
  );
}

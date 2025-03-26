
import { useForm } from '@mantine/form';
import { TextInput, Text, Button, Flex, Badge, Box, rem } from '@mantine/core';
import { useState, FormEvent, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';

import moment from 'moment';

export default function Info() {
    const isMobileLayout = useMediaQuery('(max-width: 37.5em)');
  const urlValidateRegEx = /^http:\/\/localhost:8100\/[^\/\\]+$/;
  const [serverIssue, setServerIssue] = useState('');
  const [info, setInfo] = useState<{ originalUrl: string, createdAt: string, clickCount: number} | null>(null);

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/info/${shortId}`, {
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
    <Flex direction={"column"} maw={isMobileLayout ? 300 : 600}>
        <Text c="dimmed" mb={10}>Info provides details for existing, non-expired short URLs.</Text>
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
        { info && !info.originalUrl && <Badge mt={10} color='red'>The active short URL {form.values.shortUrl} does not exist.</Badge>}
        {!!info?.originalUrl &&
          <Flex
            mt={20}
            direction={"column"}
          >
            <Badge w={"fit-content"} >{info.clickCount} redirects</Badge>
            <Box 
              sx={(theme) => ({
                backgroundColor: theme.colors.gray[0],
                borderRadius: theme.radius.md,
                padding: rem(10),
                marginTop: rem(10)
              })}>
              <Text fw={500}>Created At:</Text>
              <Badge w={"fit-content"} >{moment(info.createdAt).format('MMM DD, YYYY HH:MM')}</Badge>
            </Box>
            <Box 
              sx={(theme) => ({
                backgroundColor: theme.colors.gray[0],
                borderRadius: theme.radius.md,
                padding: rem(10),
                marginTop: rem(10),
              })}>
              <Text fw={500}>Original URL:</Text>
              <Text size={15} c="dimmed">* you can copy the original URL by clicking on it</Text>
              <Badge
                onClick={() => navigator.clipboard.writeText(info.originalUrl)}
                sx={() => ({
                  whiteSpace: 'nowrap',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor:'copy'
                })}>
                  {info.originalUrl}
              </Badge>
            </Box>
          </Flex>
        }
    </Flex>
  );
}

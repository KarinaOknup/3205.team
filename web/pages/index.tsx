
import { Text, Box, Center, Flex, Tabs } from '@mantine/core';
import {
  CreateForm,
  DeleteForm,
  InfoForm,
  AnalyticsForm,
  CustomTabs
} from '../components'

export default function Home() {
  return (
    <Center mt={100}>
      <Flex align={'center'} direction={"column"}>
        <Text size={40} my={40}>SHORT UR URL</Text>
        <Box w={600}>
          <CustomTabs defaultValue="create">
            <Tabs.List>
              <Tabs.Tab value="create">Create</Tabs.Tab>
              <Tabs.Tab value="delete">Delete</Tabs.Tab>
              <Tabs.Tab value="info">Info</Tabs.Tab>
              <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="create" pt="xs">
              <CreateForm/>
            </Tabs.Panel>
            <Tabs.Panel value="delete" pt="xs">
              <DeleteForm/>
            </Tabs.Panel>
            <Tabs.Panel value="info" pt="xs">
              <InfoForm/>
            </Tabs.Panel>
            <Tabs.Panel value="analytics" pt="xs">
              <AnalyticsForm/>
            </Tabs.Panel>
        </CustomTabs>
        </Box>
      </Flex>
    </Center>
  );
}

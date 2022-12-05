import { Tabs, TabItem, Flex, View, Link } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

export function Navbar() {
  return (
    <Tabs
      currentIndex="0"
      justifyContent="center">
      <TabItem title="Home" />
    </Tabs>
  )
}

export function PageFooter() {
  return (
    <Flex
      direction="row"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      wrap="nowrap"
      gap="10rem"
    >
      <View
        height="3rem"
      >
        <Link
          href=""
          color="#188754"
        >
          About
        </Link>
      </View>
      <View
        height="3rem"
      >
        <Link
          href=""
          color="#188754"
        >
          FAQ
        </Link>
      </View>
      <View
        height="3rem"
      >
        <Link
          href=""
          color="#188754"
        >
          Contact Us
        </Link>
      </View>
    </Flex>
  )
}


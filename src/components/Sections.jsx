import { Tabs, TabItem, Flex, View, Link, Image } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

export function Navbar() {
  return (
    <>
      <Tabs
        currentIndex="0"
        justifyContent="center">
        <TabItem title="Home"
        />
      </Tabs>
    </>
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
        height="2rem"
      >
        <Link
          href=""
          color="#188754"
        >
          About
        </Link>
      </View>
      <View
        height="4rem"
      >
        <Image
              alt="Spotify Capsule Logo"
              src="../favicon.ico"
              // objectFit="initial"
              backgroundColor="initial"
              height="100%"
              width="100%"
              opacity="100%"
            /> 
      </View>
      <View
        height="2rem"
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


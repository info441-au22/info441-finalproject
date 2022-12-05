import { Tabs, TabItem } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

function Navbar() {
    return (
<Tabs
  currentIndex="0"
  justifyContent="center">
  <TabItem title="Home" />
</Tabs>
    )
}

export default Navbar;
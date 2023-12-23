import { Disclosure } from '@headlessui/react'
import { GiHamburgerMenu } from 'react-icons/gi'

export default function SideBar() {

  return (
    <div>
      <Disclosure as='nav'>
        <Disclosure.Button className='absolute top-4 right 4 inline-flex items-center peer justify-center rounded-md p-2 focus:outline-none'>
          <GiHamburgerMenu className='block md:hidden h-6 w-6' aria-hidden='true' />
        </Disclosure.Button>
      </Disclosure>
      <div className='"p-6 w-1/2 h-screen bg-gray-400 z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200'>
        <div>

        </div>
      </div>
    </div>
  )
}
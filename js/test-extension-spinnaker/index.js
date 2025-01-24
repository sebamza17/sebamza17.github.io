/**
 * DO NOT REMOVE THIS, we're using this example for our test suite
 * on "unit/services/extensions/extension-handler-test.js"
 */
export default function run () {
  const accountNameOnTopBar = document.querySelector('.activity-name')

  if (accountNameOnTopBar) {
    // change background color
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    accountNameOnTopBar.style.backgroundColor = 'red'

    // change innerHTML
    accountNameOnTopBar.innerHTML = 'EXTENSION EXAMPLE TEXT'

    // finally, we add an attribute to know that DOM was changed by an extensions
    accountNameOnTopBar.setAttribute('data-extension-updated', 'true')
  }
}
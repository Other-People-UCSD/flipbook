/**
 * Provides high-level protection from copying media and text of our published authors!
 * If you are a user outside our organization, do not circumvent our security without permission.
 */
const copyright = () => {
  /**
   * Prevents the events that allow a user to copy an element from firing. 
   */
  const protect = (e) => {
      e.preventDefault();
  }

  /**
   * Alerts the user that they are not allowed to copy the work. This triggers once on each attempt to copy.
   */
  const alertProtect = (e) => {
      alert('COPY, REPRODUCTION, AND MODIFICATION ARE NOT PERMITTED WITHOUT PERMISSION');
      protect(e);
  }

  // Get the published article field and add the wrapped layer of protection
  let copyrighted = document.getElementById('cr-article');
  copyrighted.addEventListener('copy', protect, false);
  copyrighted.addEventListener('dragstart', protect, false);
  copyrighted.addEventListener('contextmenu', protect, false);

  // Apply protections to each paragraph and element of the work for another layer of protection
  let crChildren = copyrighted.childNodes;
  for (let i = 0; i < crChildren.length; i++) {
      crChildren[i].addEventListener('copy', alertProtect, false);
      crChildren[i].addEventListener('dragstart', protect, false);
      crChildren[i].addEventListener('contextmenu', protect, false);
  }
}

export default copyright;
<script lang="ts">
  export let avatarUrl: string = "";
</script>

<header class="border-b border-gray-100 dark:border-gray-800">
  <div class="mx-auto w-full max-w-screen-2xl px-4 flex h-16 items-center">
    <!-- Logo -->
    <div class="flex flex-1 items-center">
      <a class="mr-5 flex flex-none items-center lg:mr-6" href="/">
        <img
          alt="Hugging Face's logo"
          class="w-7 md:mr-2"
          src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
        />
        <span class="hidden whitespace-nowrap text-lg font-bold md:block dark:text-gray-100">Hugging Face</span>
      </a>

      <!-- Search -->
      <div class="relative flex-1 lg:max-w-sm mr-2 sm:mr-4 md:mr-3 xl:mr-6">
        <input
          autocomplete="off"
          spellcheck="false"
          type="text"
          class="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 h-9 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-950 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
          placeholder="Search models, datasets, users..."
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="1em"
          height="1em"
          viewBox="0 0 32 32"
          class="absolute left-2.5 text-gray-400 top-1/2 -translate-y-1/2"
        >
          <path
            d="M30 28.59L22.45 21A11 11 0 1 0 21 22.45L28.59 30zM5 14a9 9 0 1 1 9 9a9 9 0 0 1-9-9z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>

    <!-- Nav Links -->
    <nav aria-label="Main" class="ml-auto hidden lg:block">
      <ul class="flex items-center gap-x-1 2xl:gap-x-2">
        <!-- Models -->
        <li class="hover:text-indigo-700">
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/models">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24" class="mr-1.5 text-gray-400 group-hover:text-indigo-500">
              <path d="M20.23 7.24L12 12L3.77 7.24a1.98 1.98 0 0 1 .7-.71L11 2.76c.62-.35 1.38-.35 2 0l6.53 3.77c.29.173.531.418.7.71z" opacity=".25" fill="currentColor" />
              <path d="M12 12v9.5a2.09 2.09 0 0 1-.91-.21L4.5 17.48a2.003 2.003 0 0 1-1-1.73v-7.5a2.06 2.06 0 0 1 .27-1.01L12 12z" opacity=".5" fill="currentColor" />
              <path d="M20.5 8.25v7.5a2.003 2.003 0 0 1-1 1.73l-6.62 3.82c-.275.13-.576.198-.88.2V12l8.23-4.76c.175.308.268.656.27 1.01z" fill="currentColor" />
            </svg>
            Models
          </a>
        </li>

        <!-- Datasets -->
        <li class="hover:text-red-700">
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/datasets">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 25 25" class="mr-1.5 text-gray-400 group-hover:text-red-500">
              <ellipse cx="12.5" cy="5" fill="currentColor" fill-opacity="0.25" rx="7.5" ry="2" />
              <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5" />
              <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5" />
              <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor" />
            </svg>
            Datasets
          </a>
        </li>

        <!-- Spaces -->
        <li class="hover:text-blue-700">
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/spaces">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 25 25" class="mr-1.5 text-gray-400 group-hover:text-blue-500">
              <path opacity=".5" d="M6.016 14.674v4.31h4.31v-4.31h-4.31ZM14.674 14.674v4.31h4.31v-4.31h-4.31ZM6.016 6.016v4.31h4.31v-4.31h-4.31Z" fill="currentColor" />
              <path opacity=".75" fill-rule="evenodd" clip-rule="evenodd" d="M3 4.914C3 3.857 3.857 3 4.914 3h6.514c.884 0 1.628.6 1.848 1.414a5.171 5.171 0 0 1 7.31 7.31c.815.22 1.414.964 1.414 1.848v6.514A1.914 1.914 0 0 1 20.086 22H4.914A1.914 1.914 0 0 1 3 20.086V4.914Zm3.016 1.102v4.31h4.31v-4.31h-4.31Zm0 12.968v-4.31h4.31v4.31h-4.31Zm8.658 0v-4.31h4.31v4.31h-4.31Zm0-10.813a2.155 2.155 0 1 1 4.31 0 2.155 2.155 0 0 1-4.31 0Z" fill="currentColor" />
              <path opacity=".25" d="M16.829 6.016a2.155 2.155 0 1 0 0 4.31 2.155 2.155 0 0 0 0-4.31Z" fill="currentColor" />
            </svg>
            Spaces
          </a>
        </li>

        <!-- Buckets -->
        <li class="hover:text-blue-800 dark:hover:text-blue-300 max-xl:hidden">
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/storage">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 48 48" fill="none" class="mr-1.5 text-blue-600 dark:text-blue-500">
              <path opacity="0.25" d="M36 4H12C7.58172 4 4 7.58172 4 12V36C4 40.4183 7.58172 44 12 44H36C40.4183 44 44 40.4183 44 36V12C44 7.58172 40.4183 4 36 4Z" fill="currentColor" />
              <path opacity="0.5" d="M31 11H17C13.6863 11 11 13.6863 11 17V31C11 34.3137 13.6863 37 17 37H31C34.3137 37 37 34.3137 37 31V17C37 13.6863 34.3137 11 31 11Z" fill="currentColor" />
              <path d="M27 18H21C19.3431 18 18 19.3431 18 21V27C18 28.6569 19.3431 30 21 30H27C28.6569 30 30 28.6569 30 27V21C30 19.3431 28.6569 18 27 18Z" fill="currentColor" />
            </svg>
            Buckets
            <span class="ml-1.5 translate-y-px rounded bg-blue-600/15 px-1 py-px text-[.65rem] font-bold uppercase leading-tight text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">new</span>
          </a>
        </li>

        <!-- Docs -->
        <li class="hover:text-yellow-700">
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/docs">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 16 16" class="mr-1.5 text-gray-400 group-hover:text-yellow-500">
              <path d="m2.28 3.7-.3.16a.67.67 0 0 0-.34.58v8.73l.01.04.02.07.01.04.03.06.02.04.02.03.04.06.05.05.04.04.06.04.06.04.08.04.08.02h.05l.07.02h.11l.04-.01.07-.02.03-.01.07-.03.22-.12a5.33 5.33 0 0 1 5.15.1.67.67 0 0 0 .66 0 5.33 5.33 0 0 1 5.33 0 .67.67 0 0 0 1-.58V4.36a.67.67 0 0 0-.34-.5l-.3-.17v7.78a.63.63 0 0 1-.87.59 4.9 4.9 0 0 0-4.35.35l-.65.39a.29.29 0 0 1-.15.04.29.29 0 0 1-.16-.04l-.65-.4a4.9 4.9 0 0 0-4.34-.34.63.63 0 0 1-.87-.59V3.7Z" fill="currentColor" class="dark:opacity-40" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 3.1a5.99 5.99 0 0 0-5.3-.43.66.66 0 0 0-.42.62v8.18c0 .45.46.76.87.59a4.9 4.9 0 0 1 4.34.35l.65.39c.05.03.1.04.16.04.05 0 .1-.01.15-.04l.65-.4a4.9 4.9 0 0 1 4.35-.34.63.63 0 0 0 .86-.59V3.3a.67.67 0 0 0-.42-.63 5.99 5.99 0 0 0-5.29.43l-.3.18-.3-.18Zm-.63.93L8 3.6v8.26l-.02-.01a5.56 5.56 0 0 0-4.93-.4l-.02.01V3.74l.2-.1A5.32 5.32 0 0 1 7.37 4Zm1.26 0L8 3.6v8.28a5.56 5.56 0 0 1 4.95-.42V3.74l-.2-.1A5.32 5.32 0 0 0 8.63 4Z" fill="currentColor" />
            </svg>
            Docs
          </a>
        </li>

        <!-- Enterprise -->
        <li class="hover:text-black dark:hover:text-white max-2xl:hidden">
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/enterprise">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" width="1em" height="1em" viewBox="0 0 12 12" class="mr-1.5 text-gray-400 group-hover:text-black dark:group-hover:text-white">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.9 1.35a3.16 3.16 0 0 0-2.8 2.07L.37 8.58C0 9.71.7 10.65 1.86 10.65H7.3a3.2 3.2 0 0 0 2.84-2.07l1.67-5.16c.36-1.13-.3-2.07-1.46-2.07H4.91Zm.4 2.07L3.57 8.47h3.57l.36-1.12H5.4l.28-.91h1.75l.4-1.1H6.07l.3-.83h2l.36-1.1H5.27h.04Z" fill="currentColor" />
            </svg>
            Enterprise
          </a>
        </li>

        <!-- Pricing -->
        <li>
          <a class="group flex items-center px-2 py-0.5 dark:text-gray-300 dark:hover:text-gray-100" href="/pricing">
            Pricing
          </a>
        </li>

        <!-- More/overflow menu button -->
        <li>
          <div class="relative group">
            <button type="button" class="px-2 py-0.5 hover:text-gray-500 dark:hover:text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" viewBox="0 0 32 18" class="text-gray-500 w-5 group-hover:text-gray-400 dark:text-gray-300 dark:group-hover:text-gray-100">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4504 3.30221C14.4504 2.836 14.8284 2.45807 15.2946 2.45807H28.4933C28.9595 2.45807 29.3374 2.836 29.3374 3.30221C29.3374 3.76842 28.9595 4.14635 28.4933 4.14635H15.2946C14.8284 4.14635 14.4504 3.76842 14.4504 3.30221Z" fill="currentColor" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4504 9.00002C14.4504 8.53382 14.8284 8.15588 15.2946 8.15588H28.4933C28.9595 8.15588 29.3374 8.53382 29.3374 9.00002C29.3374 9.46623 28.9595 9.84417 28.4933 9.84417H15.2946C14.8284 9.84417 14.4504 9.46623 14.4504 9.00002Z" fill="currentColor" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4504 14.6978C14.4504 14.2316 14.8284 13.8537 15.2946 13.8537H28.4933C28.9595 13.8537 29.3374 14.2316 29.3374 14.6978C29.3374 15.164 28.9595 15.542 28.4933 15.542H15.2946C14.8284 15.542 14.4504 15.164 14.4504 14.6978Z" fill="currentColor" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.94849 6.07023C1.94849 5.60402 2.32643 5.22609 2.79264 5.22609H10.0856C10.5518 5.22609 10.9297 5.60402 10.9297 6.07023C10.9297 6.53644 10.5518 6.91438 10.0856 6.91438H2.79264C2.32643 6.91438 1.94849 6.53644 1.94849 6.07023Z" fill="currentColor" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.94849 11.7678C1.94849 11.3016 2.32643 10.9236 2.79264 10.9236H10.0856C10.5518 10.9236 10.9297 11.3016 10.9297 11.7678C10.9297 12.234 10.5518 12.6119 10.0856 12.6119H2.79264C2.32643 12.6119 1.94849 12.234 1.94849 11.7678Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </nav>

    <!-- User Avatar -->
    <div class="ml-2 flex items-center">
      {#if avatarUrl}
        <button class="relative cursor-pointer">
          <img
            class="size-8 rounded-full shadow-sm"
            src={avatarUrl}
            alt="User avatar"
          />
        </button>
      {:else}
        <a
          href="/login"
          class="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Log In
        </a>
      {/if}
    </div>
  </div>
</header>

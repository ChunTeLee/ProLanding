<script lang="ts">
  import ProPage from './lib/ProPage.svelte';

  const auth = { username: 'demo-user', isLoggedIn: true, isPro: false };
</script>

<ProPage {auth} promo={undefined} godmode={false} />

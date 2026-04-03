<script lang="ts">
  import type { Promotion } from "./Promotion.ts";
  export let promo: Promotion;
</script>

<div class="rounded-xl bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800">
  <p class="text-green-700 dark:text-green-300 font-medium">Promo: {promo.title} - {promo.discount}% off!</p>
</div>

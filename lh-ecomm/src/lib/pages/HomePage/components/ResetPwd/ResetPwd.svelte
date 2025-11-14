<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    let ShowResetPwd = true;
    let CreatePassword = '';
    let ConfirmPassword = '';
    let showPasswordCr = false;
    let showPasswordCon = false;
    const dispatch = createEventDispatcher();
  
    const toggleSignInForm = () => {
      ShowResetPwd = false;
      dispatch('close');
    };
  
    const CreatetogglePassword = () => {
      showPasswordCr = !showPasswordCr;
    };
  
    const ConfirmtogglePassword = () => {
      showPasswordCon = !showPasswordCon;
    };
  
    // Password validation requirements
    const requirements = [
      { regex: /.{8,}/, message: 'Min. 8 characters' },
      { regex: /[a-z]/, message: 'Lowercase characters' },
      { regex: /[0-9]/, message: 'Contains 1 number' },
      { regex: /[A-Z]/, message: 'Contains 1 uppercase' }
    ];
  
    // Reactive statement to validate password
    $: validationResults = requirements.map(({ regex }) => regex.test(CreatePassword));
    $: allRequirementsMet = validationResults.every(Boolean);
    
    // Function to handle form submission
    const handleSubmit = (event: Event) => {
      event.preventDefault();
  
      // Check if passwords match
      if (CreatePassword !== ConfirmPassword) {
        document.getElementById('pwd-dont-match-text').style.display = 'block';
        return;
      }
  
      // Check if all requirements are met
      if (!allRequirementsMet) {
        return;
      }
  
    };
  </script>
  
  <!-- Container for Reset Password -->
  {#if ShowResetPwd}
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]">
    <div class="mx-auto flex flex-col gap-2.5 w-[544px] p-7 rounded-lg border border-black bg-white-1">
      <div class="flex justify-end -mt-[15px] -mr-[15px] cursor-pointer" on:click={toggleSignInForm}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.0002 10.586L16.9502 5.63599L18.3642 7.04999L13.4142 12L18.3642 16.95L16.9502 18.364L12.0002 13.414L7.05023 18.364L5.63623 16.95L10.5862 12L5.63623 7.04999L7.05023 5.63599L12.0002 10.586Z" fill="#ADB0BA"/>
        </svg>
      </div>
      <div class="flex justify-center">
        <img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo">
      </div>
  
      <!-- Line separator -->
      <div class="h-px bg-[#E9EBF0] w-full mt-8 mb-4"></div>
  
      <div class="text-[#24252B] text-center mb-4">
        <div class="mb-2 text-2xl font-semibold leading-8">Reset Password</div>
        <div class="text-base font-normal leading-6">Create your new password and you’re good to go.</div>
      </div>
  
      <!-- Form -->
      <form class="flex flex-col gap-3" id="reset-password-form" on:submit={handleSubmit}>
        <div class="form-pwd flex flex-col gap-1">
          <label for="password-field-create" class="text-sm leading-[22px] text-[#24252B] font-bold">Create Password</label>
          <div class="flex">
            {#if showPasswordCr}
            <input
              id="password-field-create"
              type="text"
              bind:value={CreatePassword}
              placeholder="Enter your password"
              class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
              style="border-color: {allRequirementsMet ? 'green' : 'red'}"
            />
            {:else}
            <input
              id="password-field-create"
              type="password"
              bind:value={CreatePassword}
              placeholder="Enter your password"
              class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
              style="border-color: {allRequirementsMet ? 'green' : 'red'}"
            />
            {/if}
            <span class="cursor-pointer" on:click={CreatetogglePassword}>
              <i class="fa fa-fw relative z-2 mt-5" style="margin-left: -35px;" class:fa-eye={!showPasswordCr} class:fa-eye-slash={showPasswordCr}></i>
            </span>
          </div>
        </div>
  
        <!-- Password requirements list -->
        <ul class="requirement-pwd-list m-0 list-none text-[#ADB0BA] text-xs font-normal leading-5 p-0 flex gap-[70px]">
          <div>
            {#each requirements.slice(0, 2) as { message }, index}
              <li>
                <i class="fa-solid fa" class:fa-check={validationResults[index]} class:fa-minus={!validationResults[index]}></i>
                <span>{message}</span>
              </li>
            {/each}
          </div>
          <div>
            {#each requirements.slice(2) as { message }, index}
              <li>
                <i class="fa-solid fa" class:fa-check={validationResults[index + 2]} class:fa-minus={!validationResults[index + 2]}></i>
                <span>{message}</span>
              </li>
            {/each}
          </div>
        </ul>
  
        <div class="form-pwd flex flex-col gap-1">
          <label for="password-field-confirm" class="text-sm leading-[22px] text-[#24252B] font-bold">Confirm Password</label>
          <div class="flex">
            {#if showPasswordCon}
            <input
              id="password-field-confirm"
              type="text"
              bind:value={ConfirmPassword}
              placeholder="Enter your password"
              class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
            />
            {:else}
            <input
              id="password-field-confirm"
              type="password"
              bind:value={ConfirmPassword}
              placeholder="Enter your password"
              class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
            />
            {/if}
            <span class="cursor-pointer" on:click={ConfirmtogglePassword}>
              <i class="fa fa-fw relative z-2 mt-5" style="margin-left: -35px;" class:fa-eye={!showPasswordCon} class:fa-eye-slash={showPasswordCon}></i>
            </span>
          </div>
        </div>
  
        <!-- Passwords don't match warning -->
        <p id="pwd-dont-match-text" class="text-[#9F392D] text-[11px]" style="margin-top: -5px; display: none;">
          Passwords don't match
        </p>
  
        <!-- Submit button -->
        <div class="button-form-sign-in mt-8 mb-3">
          <button type="submit" class="w-full py-3 px-4 bg-[#302B29] text-white-1 text-lg leading-6 font-semibold rounded-md cursor-pointer">
            RESET PASSWORD
          </button>
        </div>
      </form>
    </div>
  </div>
  {/if}
  
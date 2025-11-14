<script lang="ts">
	import { Accordion } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import PaymentList from '$lib/components/PaymentList/PaymentList.svelte';
</script>

<div class="flex flex-col basis-3/5 max-lg:p-4">
	<!-- title -->
	<div class="flex flex-col gap-2 mb-2 lg:mb-10">
		<Text type="subtitle-3" color="black-9" weight="semibold" slot="header">
			Available Payment Methods at Luxehouze
		</Text>
		<Text type="body-2" color="black-7" class="block text-[12px] lg:text-[14px]">
			Luxehouze offers convenient payment methods to suit your needs. Choose from Bank Transfer for
			a straightforward option or use our Virtual Account for seamless transactions based on your
			preferences, listed below:
		</Text>
	</div>
	<!-- end of title -->

	<!-- alert -->
	<div
		class="hidden lg:flex p-2 rounded border border-l-[4px] border-[#756455] bg-[#F1EFED] gap-1 items-start mb-5"
	>
		<img src="/icons/snackbar.svg" alt="snakbar" class="mt-1" />
		<Text type="body-2" color="black-7" class="block text-[14px]">
			Luxehouze offers convenient payment methods to suit your needs. Choose from Bank Transfer for
			a straightforward option or use our Virtual Account for seamless transactions based on your
			preferences, listed below:
		</Text>
	</div>
	<!-- end of alert -->

	<!-- list -->
	<Accordion flush multiple>
		<PaymentList
			icon="/icons/debitcard.svg"
			title="Debit or Credit Card"
			subtitle="Use your debit or credit card for instant, secure transactions with just a few clicks."
		>
			<div class="ml-5 text-[12px] lg:text-[14px]">
				<p class="mb-5">
					Enjoy a quick and seamless payment experience with your debit or credit card. Simply enter
					your card details at checkout for instant and secure transactions. Our system ensures your
					information is encrypted and protected. For added convenience, many cards offer additional
					security features such as fraud protection and purchase guarantees
				</p>
				<p class="font-semibold">How to Use:</p>
				<ul class=" list-decimal pl-5 mb-5">
					<li>Select ‘Debit/Credit Card’ at checkout.</li>
					<li>
						Enter your card number, expiration date, and CVV or choose from the ones you’ve saved.
					</li>
					<li>Confirm the payment and complete your purchase.</li>
				</ul>
				<p class="font-semibold">For Credit Card</p>
				<ul class="list-disc pl-5">
					<li class="font-semibold">Full Payment</li>
					<li class="list-none">
						Local Indonesia issued credit card: Visa, Mastercard, JCB, American Express
					</li>
					<ul class="list-disc pl-5">
						<li>
							Fee: Additional fee applies (Please check with our client advisor for the fee or
							contact our <span class="font-bold underline">WhatsApp</span>)
						</li>
					</ul>
					<ul class="list-disc pl-5">
						<li>Limit: Per respective client's card limit</li>
					</ul>
					<ul class="list-disc pl-5">
						<li>
							Notes: For the payment details, please check with our client advisor or contact our <span
								class="font-bold underline">WhatsApp</span
							>
						</li>
					</ul>
				</ul>
				<ul class="list-disc pl-5">
					<li class="font-semibold">Installment up to 24 Months</li>
					<li class="list-none">
						Local Indonesia issued card: Visa, Mastercard, JCB, American Express
					</li>
					<ul class="list-disc pl-5">
						<li>
							Fee: Additional fee applies (Please check with our client advisor for the fee or
							contact our <span class="font-bold underline">WhatsApp</span>)
						</li>
					</ul>
					<ul class="list-disc pl-5">
						<li>Limit: Per respective client's card limit for full amount being charged</li>
					</ul>
					<ul class="list-disc pl-5">
						<li>
							Notes: For the payment details, please check with our client advisor or contact our <span
								class="font-bold underline">WhatsApp</span
							>
						</li>
					</ul>
				</ul>
			</div>
		</PaymentList>

		<PaymentList
			icon="/icons/banktransfer.svg"
			title="Bank Transfer"
			subtitle="Transfer directly from our BNI bank account for an easy and verified transaction."
		>
			<div class="ml-5 text-[12px] lg:text-[14px]">
				<p class="mb-5">
					Opt for a bank transfer for a secure and straightforward payment method. Transfer funds
					directly from your bank account to ours. This method is ideal for larger amounts and
					provides a clear record of your transaction. Be sure to include the reference number
					provided to ensure your payment is correctly matched.
				</p>
				<p class="font-semibold">Limit:</p>
				<ul class="list-disc pl-5 mb-5">
					<li>
						<strong>Mobile banking/internet banking:</strong> Per respective of the client's bank account
						limit (please check before making transaction)
					</li>
					<li><strong>Teller at the bank:</strong> No limit</li>
				</ul>
				<p class="font-semibold">Requirement:</p>
				<ul class=" list-disc pl-5 mb-5">
					<li>
						<strong>Online: </strong>Real time 24/7. Maximum limit IDR50,000,000/transaction
					</li>
					<li>
						<strong>RTGS: </strong>Cut off time at 2 pm Jakarta time on the working days, it takes
						about 30 minutes. After 2 pm Jakarta time, we will process on the next working days
					</li>
					<li><strong>BI Fast: </strong>Not available</li>
					<li><strong>LLG: </strong>Not available</li>
				</ul>
				<p class="font-semibold">How to Use:</p>
				<ul class=" list-decimal pl-5 mb-5">
					<li>Choose ‘Bank Transfer’ as your payment method at checkout.</li>
					<li>
						Use the provided bank details to initiate the transfer from your bank account (for the
						bank account details, please check with our client advisor or contact our <span
							class="font-bold underline">WhatsApp</span
						>)
					</li>
					<li>Enter the security PIN code when prompted to confirm your payment.</li>
					<li>Complete your transaction and wait for confirmation.</li>
				</ul>
			</div>
		</PaymentList>

		<PaymentList
			icon="/icons/virtualacc.svg"
			title="Virtual Account"
			subtitle="Pay through a virtual account with our BNI Virtual Account number for speedy and hassle-free transactions."
		>
			<div class="ml-5 text-[12px] lg:text-[14px]">
				<p class="mb-5">
					Use a virtual account for a flexible and efficient payment option. You’ll receive a unique
					account number for each transaction, making it easy to manage and track payments. Virtual
					accounts are perfect for keeping your payments organized and ensuring they are processed
					swiftly and accurately.
				</p>
				<p class="font-semibold">How to Use:</p>
				<ul class=" list-decimal pl-5 mb-5">
					<li>Select ‘Virtual Account’ during checkout.</li>
					<li>Enter</li>
					<li>
						Transfer the payment amount to the virtual account using your online banking or payment
						app.
					</li>
					<li>Confirm the transaction and wait for confirmation of receipt.</li>
				</ul>
			</div>
		</PaymentList>
	</Accordion>
</div>

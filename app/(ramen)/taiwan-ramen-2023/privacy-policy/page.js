import Link from 'next/link';
import styles from './styles.module.css'

export default function Page() {
    const PrivacyPolicyZh = (
          <div>
            <h2>隱私政策</h2>
            <p>謝謝您訪問2023台灣拉麵101。您的隱私至關重要，我們致力於保護您的個人資訊。
              在此我們將解釋我們如何收集，使用及保護您的個人資訊。</p>
            <h3>收集的訊息：</h3>
            <p>若您選擇以Google帳戶登入，我們將收集您的名字和電子郵件地址，您有權在任何時候自行修改您的帳戶訊息。</p>
            <h3>資訊如何被使用：</h3>
            <p>您的個人資訊會被用於評價拉麵店和分享您的評論。
              但是我們將不會將您的個人資訊提供給第三方。</p>
            <h3>隱私的保護：</h3>
            <p>我們有系統和程序監視保護您的隱私不被侵犯。
              您若在此網站進行任何活動，都代表您同意此隱私政策。
              若您不重新回頁面或網站，代表您已經接受這類的隱私政策條款。
              我們有權更改隱私政策，我們將會在頁面上公佈。</p>
            <p>本政策最後更新日為2023年9月6日。</p>
          </div>
        );
      
      const PrivacyPolicyEn = (
          <div>
            <h2>Privacy Policy</h2>
            <p>Thank you for visiting Taiwan Ramen 2023. Your privacy is important to us and we are committed to safeguarding your personal information.
              Here is our commitment to protect your data and how we use it.</p>
            <h3>Data Collected:</h3>
            <p>When you choose to log in with a Google account, we collect your name and email address and you can modify your account details at any time.</p>
            <h3>How Information is Used:</h3>
            <p>Your personal information is used to rate the ramen restaurants and share your feedback.
              However, we will not provide your personal information to third parties.</p>
            <h3>Privacy Protection:</h3>
            <p>We have procedures in place to monitor and safeguard your privacy.
              Any activities you perform on this website signify your agreement to this privacy policy.
              If you do not revisit the webpage or website, you accept these privacy policy terms.
              We reserve the right to change our privacy policy and will announce any changes on the website.</p>
            <p>This policy was last updated on 2023/09/06.</p>
          </div>
        );
      
    return (<article className={styles.article}>
        <Link href="../">《 返回</Link>
        {PrivacyPolicyZh}
        {PrivacyPolicyEn}
    </article>);
   }
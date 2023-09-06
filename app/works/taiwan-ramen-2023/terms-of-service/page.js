import Link from 'next/link';
import styles from './styles.module.css'

export default function Page() {
    const TermsOfServiceZh = (
          <div>
            <h2>服務條款</h2>
            <p>歡迎您使用2023台灣拉麵101的網站。繼續使用我們的網站表示您接受以下的條款。若不接受，請立即離開本網站。</p>
            <p>當您選擇使用我們的網站，代表您同意上傳和分享您的評論和照片，而這些都具有公開的性質。</p>
            <p>您同意不發布任何含有攻擊、威脅、誤導、淫穢或其他不適當內容的評論。</p>
            <p>本網站及其內容按“現況”提供，不提供任何形式的明示或默示擔保。</p>
            <p>這些條款可能會定期更新，請定期查閱以確保您知道任何變動。最後的修訂日期為2023年9月6日。</p>
          </div>
    );
    const TermsOfServiceEn = (
          <div>
            <h2>Terms of Service</h2>
            <p>Welcome to Taiwan Ramen 2023. Continuing to use our website implies your acceptance of the terms laid out below. If you do not accept these terms, please refrain from using this website.</p>
            <p>By opting to use our website, you consent to the uploading and sharing of your feedback and pictures, which are inherently public in nature.</p>
            <p>You agree not to post reviews that contain threats, false or misleading information, obscenities, or any other inappropriate content.</p>
            <p>This website and its content are provided "as is", with no express or implied warranties.</p>
            <p>These terms may be updated periodically, so please review them frequently to ensure that you are aware of any changes.</p>
            <p>This policy was last updated on 2023/09/06.</p>
          </div>
    );
      
      
    return (<article className={styles.article}>
        <Link href="../">《 返回</Link>
        {TermsOfServiceZh}
        {TermsOfServiceEn}
    </article>);
   }
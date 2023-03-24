import '../styles/Footer.css';

import { RiLinkedinFill } from 'react-icons/ri';
import { RiGithubFill } from 'react-icons/ri';
import { SiTelegram } from 'react-icons/si';
import { RiInstagramLine } from 'react-icons/ri';

export default function MyFooter() {
    const openLink = (link) => {
        window.open(link);
    }

    return (
        <div className="FooterContainer">
            <div className='Media'>
                <div onClick={() => openLink('https://www.linkedin.com/in/alexonthespot')} className='SocialLink'>
                    <RiLinkedinFill size={24} />
                </div>
                <div onClick={() => openLink('https://github.com/alexonthespot7')} className='SocialLink'>
                    <RiGithubFill size={24} />
                </div>
                <div onClick={() => openLink('https://t.me/axosinc')} className='SocialLink'>
                    <SiTelegram size={24} />
                </div>
                <div onClick={() => openLink('https://www.instagram.com/mark_eto_leha_dobav')} className='SocialLink'>
                    <RiInstagramLine size={24} />
                </div>
            </div>
            <div className='FooterInfo'>
                ALEKSEI SHEVELENKOV <span className='Year'>©2023</span>
            </div>
        </div >
    );
}
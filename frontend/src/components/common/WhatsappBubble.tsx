import whatsappLogo from '@/assets/images/whatsapp-logo.png'

function WhatsappBubble() {
  return (
    <div className="fixed right-4 bottom-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-success shadow-lg transition-transform hover:scale-110">
      <img className="h-full w-full object-contain p-2.5" src={whatsappLogo} alt="Logo de WhatsApp" />
    </div>
  )
}

export default WhatsappBubble

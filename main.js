const receiveModal = document.querySelector('.modal-overlay')

const Modal = {
    open() {
        receiveModal.classList.add('active')
    },
    close() {
        receiveModal.classList.remove('active')
    }
}

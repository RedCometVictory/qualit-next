import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import DetailLayout from '@/components/layouts/DetailLayout';

const Ticket = () => {
  return (
    <section className="ticket">
      This is the ticket detail page.
    </section>
  );
};
export default Ticket;
Ticket.getLayout = function getLayout(Ticket) {
  return <DetailLayout>{Ticket}</DetailLayout>
}
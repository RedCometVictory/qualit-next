import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import DetailLayout from '@/components/layouts/DetailLayout';

const Project = () => {
  return (
    <section className="ticket">
      This is the project detail page.
    </section>
  );
};
export default Project;
Project.getLayout = function getLayout(Project) {
  return <DetailLayout>{Project}</DetailLayout>
}